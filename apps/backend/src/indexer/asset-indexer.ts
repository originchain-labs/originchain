import { parseAbiItem } from "viem";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { storageService } from "../services/storage/index.js";
import { chainClient, CONTRACTS } from "../services/blockchain/registry.js";
import { readContract } from "../services/blockchain/read.js";
import { getLogs } from "../services/blockchain/events.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const CONTRACT_ADDRESS = CONTRACTS.assetRegistry.address;
const INDEXER_NAME = "asset-registry-indexer";
const POLL_INTERVAL_MS = 10_000;
const CHUNK_SIZE = 100_000n;

// Block containing the AssetRegistry deployment tx on Arbitrum Sepolia
// (0x1156db7d24e457e9cff64d55182f3108791a1cd54b9f8a85c7dc3e96bc4d3012).
const CONTRACT_DEPLOYMENT_BLOCK = 295920616n;

const assetRegisteredEvent = parseAbiItem(
    "event AssetRegistered(bytes32 indexed hash, address indexed creator, string ipfs_cid, uint64 timestamp)"
);

async function getLastIndexedBlock(): Promise<bigint> {
    const state = await prisma.indexerState.findUnique({ where: { indexerName: INDEXER_NAME } });
    return state ? state.lastBlock : CONTRACT_DEPLOYMENT_BLOCK;
}

async function saveLastIndexedBlock(block: bigint) {
    await prisma.indexerState.upsert({
        where: { indexerName: INDEXER_NAME },
        create: { indexerName: INDEXER_NAME, lastBlock: block },
        update: { lastBlock: block },
    });
}

async function processAssetLog(log: any) {
    const { hash, creator } = log.args;
    if (!hash || !creator) return;

    const existing = await prisma.asset.findUnique({ where: { contentHash: hash } });

    if (existing) {
        if (!existing.onChainConfirmed) {
            await prisma.asset.update({
                where: { contentHash: hash },
                data: { onChainConfirmed: true, txHash: log.transactionHash },
            });
            console.log(`[indexer] Confirmed asset ${hash} (tx ${log.transactionHash})`);
        }
        return;
    }

    // Orphaned registration: exists on-chain, but /confirm was never
    // called (e.g. user closed the tab after signing). Reconstruct from
    // on-chain + IPFS data rather than leaving it permanently invisible.
    try {
        const [, ipfsCid, metadataCid, registeredAt] = (await readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACTS.assetRegistry.abi,
            functionName: "getAsset",
            args: [hash],
        })) as [string, string, string, bigint, boolean];

        const creatorRow = await prisma.creator.findUnique({ where: { walletAddress: creator } });
        if (!creatorRow) {
            console.warn(`[indexer] Orphaned asset ${hash}: creator ${creator} not found in Postgres, skipping`);
            return;
        }

        const metadataUrl = storageService.getGatewayUrl(metadataCid);
        const metadataRes = await fetch(metadataUrl);
        if (!metadataRes.ok) throw new Error(`Metadata fetch failed: ${metadataRes.status}`);
        const metadata = (await metadataRes.json()) as { title: string; description?: string };

        await prisma.asset.create({
            data: {
                creatorId: creatorRow.id,
                contentHash: hash,
                ipfsCid,
                metadataCid,
                title: metadata.title,
                description: metadata.description ?? null,
                txHash: log.transactionHash,
                registeredAt: new Date(Number(registeredAt) * 1000),
                onChainConfirmed: true,
            },
        });
        console.log(`[indexer] Recovered orphaned asset ${hash} from on-chain + IPFS data`);
    } catch (err) {
        console.error(`[indexer] Failed to recover orphaned asset ${hash}:`, err);
    }
}

export async function pollOnce() {
    const fromBlock = (await getLastIndexedBlock()) + 1n;
    const toBlock = await chainClient.getBlockNumber();
    if (fromBlock > toBlock) return;

    await getLogs(
        {
            address: CONTRACT_ADDRESS,
            event: assetRegisteredEvent,
            fromBlock,
            toBlock,
        },
        {
            maxBlockRange: CHUNK_SIZE,
            onChunkSuccess: async (chunkToBlock, chunkLogs) => {
                for (const log of chunkLogs) {
                    await processAssetLog(log);
                }
                await saveLastIndexedBlock(chunkToBlock);
            },
        }
    );
}

export function startAssetIndexer() {
    console.log("[indexer] Starting asset registry indexer...");
    pollOnce().catch((err) => console.error("[indexer] Poll error:", err));

    setInterval(() => {
        pollOnce().catch((err) => console.error("[indexer] Poll error:", err));
    }, POLL_INTERVAL_MS).unref();
}