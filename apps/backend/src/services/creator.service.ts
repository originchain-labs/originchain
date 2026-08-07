import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { pinJSON } from "./storage/pinata.service.js";

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
    const profileCid = await pinJSON(profileMetadata);

    const creator = await prisma.creator.create({
        data: {
            walletAddress,
            displayName: data.displayName,
            bio: data.bio ?? null,
            avatarCid: data.avatarCid ?? null,
        },
    });

    return { creator, profileCid };
}

export async function getCreatorByWallet(walletAddress: string) {
    return prisma.creator.findUnique({ where: { walletAddress } });
}