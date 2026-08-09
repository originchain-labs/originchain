import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { submitReview, getAssetReviews } from "../services/review.service.js";

export async function submit(req: AuthedRequest, res: Response) {
    try {
        const { assetId, rating, comment, txHash } = req.body;
        const review = await submitReview(req.walletAddress!, assetId, rating, comment, txHash);
        res.status(201).json(review);
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
        const errorMap: Record<string, { status: number; code: string }> = {
            CREATOR_NOT_FOUND: { status: 404, code: "CREATOR_NOT_FOUND" },
            ASSET_NOT_FOUND: { status: 404, code: "ASSET_NOT_FOUND" },
            ALREADY_REVIEWED: { status: 409, code: "ALREADY_REVIEWED" },
            TX_NOT_FOUND_ON_CHAIN: { status: 400, code: "TX_NOT_FOUND_ON_CHAIN" },
        };
        const mapped = errorMap[message] || { status: 500, code: "UNKNOWN_ERROR" };
        res.status(mapped.status).json({ error: { code: mapped.code, message } });
    }
}

export async function listForAsset(req: AuthedRequest, res: Response) {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const result = await getAssetReviews(String(req.params.id), page, limit);
    res.json(result);
}