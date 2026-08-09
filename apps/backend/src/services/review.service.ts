import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const chainClient = createPublicClient({ chain: arbitrumSepolia, transport: http(process.env.RPC_URL) });

export async function submitReview(
    reviewerWalletAddress: string,
    assetId: string,
    rating: number,
    comment: string | undefined,
    txHash: `0x${string}`
) {
    const reviewer = await prisma.creator.findUnique({ where: { walletAddress: reviewerWalletAddress } });
    if (!reviewer) throw new Error("CREATOR_NOT_FOUND");

    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new Error("ASSET_NOT_FOUND");

    const existing = await prisma.review.findUnique({
        where: { assetId_reviewerId: { assetId, reviewerId: reviewer.id } },
    });
    if (existing) throw new Error("ALREADY_REVIEWED");

    const receipt = await chainClient.getTransactionReceipt({ hash: txHash }).catch(() => null);
    if (!receipt || receipt.status !== "success") {
        throw new Error("TX_NOT_FOUND_ON_CHAIN");
    }

    return prisma.review.create({
        data: { assetId, reviewerId: reviewer.id, rating, comment: comment ?? null, txHash },
    });
}

export async function getAssetReviews(assetId: string, page: number, limit: number) {
    const [results, total, aggregate] = await Promise.all([
        prisma.review.findMany({
            where: { assetId },
            include: { reviewer: { select: { displayName: true, walletAddress: true } } },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.review.count({ where: { assetId } }),
        prisma.review.aggregate({ where: { assetId }, _avg: { rating: true } }),
    ]);

    return { results, page, total, averageRating: aggregate._avg.rating };
}