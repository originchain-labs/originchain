import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { storageService } from "./storage/index.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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