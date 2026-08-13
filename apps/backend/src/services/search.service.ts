import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

export async function search(q: string) {
    const [creators, assets, tags] = await Promise.all([
        prisma.creator.findMany({
            where: { displayName: { contains: q, mode: "insensitive" } },
            take: 10,
            select: { id: true, displayName: true, walletAddress: true, avatarCid: true },
        }),
        // Match assets by title OR by any associated tag name (case-insensitive).
        prisma.asset.findMany({
            where: {
                onChainConfirmed: true,
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
                ],
            },
            take: 10,
            include: {
                creator: { select: { displayName: true } },
                // Include the real tag names for each asset result.
                tags: { include: { tag: { select: { name: true } } } },
            },
        }),
        // Real top-level tag matches: Tag rows whose name matches the query.
        prisma.tag.findMany({
            where: { name: { contains: q, mode: "insensitive" } },
            take: 10,
            select: { id: true, name: true },
        }),
    ]);

    // Reshape asset results: surface tag names as a flat string[] on each asset.
    const assetsWithTags = assets.map(({ tags: assetTags, ...rest }) => ({
        ...rest,
        tags: assetTags.map((at) => at.tag.name),
    }));

    return {
        creators,
        assets: assetsWithTags,
        tags,
        total: creators.length + assets.length + tags.length,
    };
}