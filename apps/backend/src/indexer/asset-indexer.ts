import { createPublicClient, http, parseAbiItem } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import { assetRegistryAbi } from "@originchain/shared-types/contracts/assetRegistry";
import { storageService } from "../services/storage/index.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`;
const INDEXER_NAME = "asset-registry-indexer";
const POLL_INTERVAL_MS = 10_000;

// Block containing the AssetRegistry deployment tx on Arbitrum Sepolia
// (0x1156db7d24e457e9cff64d55182f3108791a1cd54b9f8a85c7dc3e96bc4d3012).
// AssetRegistered events can't exist before this block, so it's the correct
// first-run starting point — confirmed via eth_getTransactionReceipt
// (contractAddress in the receipt matches CONTRACT_ADDRESS above) and
// cross-checked against eth_getTransactionByHash.
const CONTRACT_DEPLOYMENT_BLOCK = 295920616n;

const assetRegisteredEvent = parseAbiItem(
    "event AssetRegistered(bytes32 indexed hash, address indexed creator, string ipfs_cid, uint64 timestamp)"
);

const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.RPC_URL),
});

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

export async function pollOnce() {
    const fromBlock = (await getLastIndexedBlock()) + 1n;
    const toBlock = await client.getBlockNumber();
    if (fromBlock > toBlock) return;

    const logs = await client.getLogs({
        address: CONTRACT_ADDRESS,
        event: assetRegisteredEvent,
        fromBlock,
        toBlock,
    });

    for (const log of logs) {
        const { hash, creator } = log.args;
        if (!hash || !creator) continue;

        const existing = await prisma.asset.findUnique({ where: { contentHash: hash } });

        if (existing) {
            if (!existing.onChainConfirmed) {
                await prisma.asset.update({
                    where: { contentHash: hash },
                    data: { onChainConfirmed: true, txHash: log.transactionHash },
                });
                console.log(`[indexer] Confirmed asset ${hash} (tx ${log.transactionHash})`);
            }
            continue;
        }

        // Orphaned registration: exists on-chain, but /confirm was never
        // called (e.g. user closed the tab after signing). Reconstruct from
        // on-chain + IPFS data rather than leaving it permanently invisible.
        try {
            const [, ipfsCid, metadataCid, registeredAt] = (await client.readContract({
                address: CONTRACT_ADDRESS,
                abi: assetRegistryAbi,
                functionName: "getAsset",
                args: [hash],
            })) as [string, string, string, bigint, boolean];

            const creatorRow = await prisma.creator.findUnique({ where: { walletAddress: creator } });
            if (!creatorRow) {
                console.warn(`[indexer] Orphaned asset ${hash}: creator ${creator} not found in Postgres, skipping`);
                continue;
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
            // Don't rethrow — one bad orphan shouldn't block indexing the rest
            // of this batch or advancing lastBlock for everything else.
        }
    }

    await saveLastIndexedBlock(toBlock);
}

export function startAssetIndexer() {
    console.log("[indexer] Starting asset registry indexer...");
    pollOnce().catch((err) => console.error("[indexer] Poll error:", err));

    setInterval(() => {
        pollOnce().catch((err) => console.error("[indexer] Poll error:", err));
    }, POLL_INTERVAL_MS).unref();
}