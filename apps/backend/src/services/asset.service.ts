import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { createHash } from "crypto";
import { storageService } from "./storage/index.js";
import { suggestMetadata } from "./ai/gemini.provider.js";
import { detectAndValidateFileType, sanitizeFileName, validateImageBuffer } from "../utils/upload-validator.js";

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
    const cleanFileName = sanitizeFileName(fileName);
    const detected = await detectAndValidateFileType(fileBuffer);
    const validatedBuffer = await validateImageBuffer(fileBuffer, detected.mime);

    // Server-side hash re-verification on EXACT original bytes — never trust client hash
    const contentHash = "0x" + createHash("sha256").update(validatedBuffer).digest("hex");

    const file = new File([new Uint8Array(validatedBuffer)], cleanFileName, { type: detected.mime });
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

export async function getAssetById(id: string) {
    return prisma.asset.findUnique({ where: { id }, include: { creator: true } });
}

export async function updateAssetCertificateCid(id: string, certificateCid: string) {
    return prisma.asset.update({ where: { id }, data: { certificateCid } });
}

export async function getOrCreateProofId(assetId: string): Promise<string> {
    const asset = await prisma.asset.findUniqueOrThrow({ where: { id: assetId } });
    if (asset.proofId) return asset.proofId;
    const result = await prisma.$queryRaw<{ nextval: bigint }[]>`SELECT nextval('proof_id_seq')`;
    const proofId = `OC-${result[0]!.nextval.toString().padStart(6, "0")}`;
    await prisma.asset.update({ where: { id: assetId }, data: { proofId } });
    return proofId;
}

export async function listAssets(params: { creatorId?: string | undefined; q?: string | undefined; page: number; limit: number }) {
    const where = {
        ...(params.creatorId && { creatorId: params.creatorId }),
        ...(params.q && { title: { contains: params.q, mode: "insensitive" as const } }),
        onChainConfirmed: true, // only show confirmed assets publicly
    };

    const [results, total] = await Promise.all([
        prisma.asset.findMany({
            where,
            include: { creator: { select: { displayName: true, walletAddress: true } } },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            orderBy: { registeredAt: "desc" },
        }),
        prisma.asset.count({ where }),
    ]);

    return { results, page: params.page, total };
}

export async function verifyByHash(contentHash: string) {
    const asset = await prisma.asset.findUnique({
        where: { contentHash, onChainConfirmed: true },
        include: { creator: { select: { displayName: true, walletAddress: true } } },
    });
    return asset;
}

export async function verifyByProofId(proofId: string) {
    const asset = await prisma.asset.findUnique({
        where: { proofId, onChainConfirmed: true },
        include: { creator: { select: { displayName: true, walletAddress: true } } },
    });
    return asset;
}