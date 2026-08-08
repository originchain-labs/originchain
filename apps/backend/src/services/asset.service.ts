import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { createHash } from "crypto";
import { storageService } from "./storage/index.js";
import { suggestMetadata } from "./ai/gemini.provider.js";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const chainClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.RPC_URL),
});

export async function prepareAsset(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    title?: string,
    description?: string
) {
    // Server-side hash re-verification — never trust a client-submitted hash.
    const contentHash = "0x" + createHash("sha256").update(fileBuffer).digest("hex");

    const file = new File([new Uint8Array(fileBuffer)], fileName, { type: mimeType });
    const { cid: ipfsCid } = await storageService.pinFile(file);

    const suggestedMetadata = await suggestMetadata(title, description);

    return { contentHash, ipfsCid, suggestedMetadata };
}

export async function finalizeMetadata(finalMetadata: {
    title: string;
    description?: string;
    tags?: string[];
}) {
    const metadataDoc = {
        version: 1,
        schema: "originchain.asset.v1",
        title: finalMetadata.title,
        description: finalMetadata.description ?? "",
        tags: finalMetadata.tags ?? [],
    };
    const { cid: metadataCid } = await storageService.pinJSON(metadataDoc);
    return { metadataCid };
}

export async function confirmAsset(
    walletAddress: string,
    contentHash: string,
    ipfsCid: string,
    metadataCid: string,
    txHash: `0x${string}`,
    finalMetadata: { title: string; description?: string; tags?: string[] }
) {
    const creator = await prisma.creator.findUnique({ where: { walletAddress } });
    if (!creator) throw new Error("CREATOR_NOT_FOUND");

    const existing = await prisma.asset.findUnique({ where: { contentHash } });
    if (existing) throw new Error("ASSET_ALREADY_REGISTERED");

    const receipt = await chainClient.getTransactionReceipt({ hash: txHash }).catch(() => null);
    if (!receipt || receipt.status !== "success") {
        throw new Error("TX_NOT_FOUND_ON_CHAIN");
    }

    const asset = await prisma.asset.create({
        data: {
            creatorId: creator.id,
            contentHash,
            ipfsCid,
            metadataCid,
            title: finalMetadata.title,
            description: finalMetadata.description ?? null,
            txHash,
            registeredAt: new Date(),
            onChainConfirmed: true,
        },
    });

    return asset;
}