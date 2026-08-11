import { parseAbiItem } from "viem";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { chainClient, CONTRACTS } from "../services/blockchain/registry.js";
import { getLogs } from "../services/blockchain/events.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CONTRACT_ADDRESS = CONTRACTS.creatorRegistry.address;
const INDEXER_NAME = "creator-registry-indexer";
const POLL_INTERVAL_MS = 10_000; // 10 seconds — fine for testnet/dev pace

// Block containing the CreatorRegistry deployment tx on Arbitrum Sepolia
// (0x8a7c47a111e3b722dfc2696b15db5784fe19d15ea44c4dd8a7df03876b92f48e).
// CreatorRegistered events can't exist before this block, so it's the
// correct first-run starting point — confirmed via eth_getTransactionReceipt
// (contractAddress in the receipt matches CONTRACT_ADDRESS above).
const CONTRACT_DEPLOYMENT_BLOCK = 294428245n;

const creatorRegisteredEvent = parseAbiItem(
    "event CreatorRegistered(address indexed creator, string profile_cid, uint64 timestamp)"
);

async function getLastIndexedBlock(): Promise<bigint> {
    const state = await prisma.indexerState.findUnique({ where: { indexerName: INDEXER_NAME } });
    if (state) return state.lastBlock;

    // First run: start from the contract's deployment block, not genesis —
    // avoids scanning the entire chain history for events that can't exist
    // before the contract existed. Hardcoded here since we only deploy once.
    return CONTRACT_DEPLOYMENT_BLOCK;
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
    const toBlock = await chainClient.getBlockNumber();

    if (fromBlock > toBlock) return; // nothing new

    const logs = await getLogs({
        address: CONTRACT_ADDRESS,
        event: creatorRegisteredEvent,
        fromBlock,
        toBlock,
    });

    for (const log of logs) {
        const { creator, profile_cid } = log.args;
        if (!creator || !profile_cid) continue;

        // Idempotent: whether the Postgres row already exists (created by the
        // backend's direct-write path) or not (e.g. someone registered on-chain
        // via a different client entirely), this always ends in the correct
        // confirmed state.
        await prisma.creator.upsert({
            where: { walletAddress: creator },
            create: {
                walletAddress: creator,
                displayName: "", // unknown from on-chain data alone; backend's
                // direct write is expected to have set this already
                // in the common case
                onChainConfirmed: true,
                registrationTxHash: log.transactionHash,
            },
            update: {
                onChainConfirmed: true,
                registrationTxHash: log.transactionHash,
            },
        });

        console.log(`[indexer] Confirmed creator ${creator} (tx ${log.transactionHash})`);
    }

    await saveLastIndexedBlock(toBlock);
}

export function startCreatorIndexer() {
    console.log("[indexer] Starting creator registry indexer...");
    pollOnce().catch((err) => console.error("[indexer] Poll error:", err));

    setInterval(() => {
        pollOnce().catch((err) => console.error("[indexer] Poll error:", err));
    }, POLL_INTERVAL_MS).unref();
}