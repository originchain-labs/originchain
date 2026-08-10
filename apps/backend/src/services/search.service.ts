import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

export async function search(q: string) {
    const [creators, assets] = await Promise.all([
        prisma.creator.findMany({
            where: { displayName: { contains: q, mode: "insensitive" } },
            take: 10,
            select: { id: true, displayName: true, walletAddress: true, avatarCid: true },
        }),
        prisma.asset.findMany({
            where: { title: { contains: q, mode: "insensitive" }, onChainConfirmed: true },
            take: 10,
            include: { creator: { select: { displayName: true } } },
        }),
    ]);

    return { creators, assets, tags: [], total: creators.length + assets.length };
}