import { z } from "zod";

export const finalizeMetadataSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const confirmAssetSchema = z.object({
    contentHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
    ipfsCid: z.string().min(1),
    metadataCid: z.string().min(1),
    txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
    finalMetadata: z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});