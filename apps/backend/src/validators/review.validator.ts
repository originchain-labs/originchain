import { z } from "zod";

export const submitReviewSchema = z.object({
    assetId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
    txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});