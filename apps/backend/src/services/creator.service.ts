import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { storageService } from "./storage/index.js";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { reputationManagerAbi } from "@originchain/shared-types/contracts/reputationManager";
import { assetRegistryAbi } from "@originchain/shared-types/contracts/assetRegistry";
import { reviewRegistryAbi } from "@originchain/shared-types/contracts/reviewRegistry";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";

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