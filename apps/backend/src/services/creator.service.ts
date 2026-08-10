import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { storageService } from "./storage/index.js";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { reputationManagerAbi } from "@originchain/shared-types/contracts/reputationManager";
import { assetRegistryAbi } from "@originchain/shared-types/contracts/assetRegistry";
import { reviewRegistryAbi } from "@originchain/shared-types/contracts/reviewRegistry";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import { generateInsightsSummary } from "./ai/gemini.provider.js";
import { parseAbiItem } from "viem";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const chainClient = createPublicClient({ chain: arbitrumSepolia, transport: http(process.env.RPC_URL) });
const REPUTATION_MANAGER = CONTRACT_ADDRESSES.arbitrumSepolia.reputationManager as `0x${string}`;

export async function createCreatorProfile(
    walletAddress: string,
    data: { displayName: string; bio?: string; avatarCid?: string }
) {
    const existing = await prisma.creator.findUnique({ where: { walletAddress } });
    if (existing) {
        throw new Error("PROFILE_ALREADY_EXISTS");
    }

    const profileMetadata = {
        version: 1,
        schema: "originchain.profile.v1",
        displayName: data.displayName,
        bio: data.bio ?? "",
        avatarCid: data.avatarCid ?? "",
    };
    const { cid: profileCid } = await storageService.pinJSON(profileMetadata);

    const creator = await prisma.creator.create({
        data: {
            walletAddress,
            displayName: data.displayName,
            bio: data.bio ?? null,
            avatarCid: data.avatarCid ?? null,
            onChainConfirmed: false, // indexer flips this once the tx confirms
        },
    });

    return { creator, profileCid };
}

export async function getCreatorByWallet(walletAddress: string) {
    return prisma.creator.findUnique({ where: { walletAddress } });
}

export async function getCreatorReputation(creatorId: string) {
    const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
    if (!creator) throw new Error("CREATOR_NOT_FOUND");

    const walletAddress = creator.walletAddress as `0x${string}`;

    const onChainScore = await chainClient.readContract({
        address: REPUTATION_MANAGER,
        abi: reputationManagerAbi,
        functionName: "getScore",
        args: [walletAddress],
    });

    const assetHashes = await chainClient.readContract({
        address: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`,
        abi: assetRegistryAbi,
        functionName: "getAssetsByCreator",
        args: [walletAddress],
    });

    let totalReviews = 0;
    for (const hash of assetHashes) {
        const count = await chainClient.readContract({
            address: CONTRACT_ADDRESSES.arbitrumSepolia.reviewRegistry as `0x${string}`,
            abi: reviewRegistryAbi,
            functionName: "getReviewCount",
            args: [hash],
        });
        totalReviews += Number(count);
    }

    await prisma.creator.update({
        where: { id: creatorId },
        data: { reputationScore: Number(onChainScore), reputationUpdatedAt: new Date() },
    });

    return {
        creatorId,
        score: Number(onChainScore),
        assetCount: assetHashes.length,
        reviewCount: totalReviews,
        lastUpdated: new Date(),
    };
}


const reviewSubmittedEvent = parseAbiItem(
    "event ReviewSubmitted(bytes32 indexed asset_hash, address indexed reviewer, uint8 rating, uint64 timestamp)"
);


export async function getCreatorInsights(creatorId: string) {
    const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
    if (!creator) throw new Error("CREATOR_NOT_FOUND");

    const walletAddress = creator.walletAddress as `0x${string}`;

    const assetHashes = await chainClient.readContract({
        address: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`,
        abi: assetRegistryAbi,
        functionName: "getAssetsByCreator",
        args: [walletAddress],
    });

    const assetDetails = await Promise.all(
        assetHashes.map((hash) =>
            chainClient.readContract({
                address: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`,
                abi: assetRegistryAbi,
                functionName: "getAsset",
                args: [hash],
            })
        )
    );
    const assetTimestamps = assetDetails.map(([, , , registeredAt]) => new Date(Number(registeredAt) * 1000));

    // Fully on-chain review data: query ReviewSubmitted events directly,
    // one getLogs call per asset hash (indexed field, so this is an
    // efficient filtered query, not a full-chain scan). This is the same
    // event-log pattern already used by asset-indexer.ts - no contract
    // change needed, since the event already carries rating + timestamp.
    //
    // "earliest"/"latest" string literals aren't accepted by this RPC
    // provider for eth_getLogs (confirmed via direct testing - it requires
    // real block numbers), so bound the range explicitly: AssetRegistry's
    // known deployment block (295920616, from asset-indexer.ts) as a safe
    // lower bound — ReviewRegistry was deployed after it, so no real
    // ReviewSubmitted event can exist before this block — through the
    // current block height.
    const toBlock = await chainClient.getBlockNumber();
    const allReviews: { rating: number; timestamp: Date }[] = [];
    for (const hash of assetHashes) {
        const logs = await chainClient.getLogs({
            address: CONTRACT_ADDRESSES.arbitrumSepolia.reviewRegistry as `0x${string}`,
            event: reviewSubmittedEvent,
            args: { asset_hash: hash },
            fromBlock: 295920616n,
            toBlock,
        });
        for (const log of logs) {
            if (log.args.rating === undefined || log.args.timestamp === undefined) continue;
            allReviews.push({
                rating: log.args.rating,
                timestamp: new Date(Number(log.args.timestamp) * 1000),
            });
        }
    }

    const onChainScore = await chainClient.readContract({
        address: REPUTATION_MANAGER,
        abi: reputationManagerAbi,
        functionName: "getScore",
        args: [walletAddress],
    });

    const totalAssets = assetHashes.length;
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : null;

    const stats = {
        totalAssets,
        totalReviews,
        averageRating,
        reputationScore: Number(onChainScore),
    };

    const aiSummary = await generateInsightsSummary(stats);

    return {
        ...stats,
        assetsOverTime: groupByDate(assetTimestamps),
        reviewsOverTime: groupReviewsByDate(allReviews.map((r) => ({ rating: r.rating, createdAt: r.timestamp }))),
        aiSummary,
    };
}

function groupByDate(dates: Date[]): { date: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const d of dates) {
        const key = d.toISOString().slice(0, 10);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

function groupReviewsByDate(
    reviews: { rating: number; createdAt: Date }[]
): { date: string; count: number; averageRating: number }[] {
    const grouped = new Map<string, number[]>();
    for (const r of reviews) {
        const key = r.createdAt.toISOString().slice(0, 10);
        grouped.set(key, [...(grouped.get(key) ?? []), r.rating]);
    }
    return Array.from(grouped.entries()).map(([date, ratings]) => ({
        date,
        count: ratings.length,
        averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
    }));
}