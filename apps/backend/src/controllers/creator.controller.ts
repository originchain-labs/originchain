import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { createCreatorProfile, getCreatorByWallet, getCreatorReputation } from "../services/creator.service.js";

export async function createProfile(req: AuthedRequest, res: Response) {
    try {
        const result = await createCreatorProfile(req.walletAddress!, req.body);
        res.status(201).json(result);
    } catch (err) {
        if (err instanceof Error && err.message === "PROFILE_ALREADY_EXISTS") {
            return res.status(409).json({ error: { code: "PROFILE_ALREADY_EXISTS", message: "Profile already exists for this wallet" } });
        }
        res.status(500).json({ error: { code: "UNKNOWN_ERROR", message: "Failed to create profile" } });
    }
}

export async function getProfile(req: AuthedRequest, res: Response) {
    const { walletAddress } = req.params;
    if (!walletAddress || Array.isArray(walletAddress)) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "walletAddress is required" } });
    }
    const creator = await getCreatorByWallet(walletAddress);
    if (!creator) {
        return res.status(404).json({ error: { code: "CREATOR_NOT_FOUND", message: "Creator not found" } });
    }
    res.json(creator);
}

export async function getReputation(req: AuthedRequest, res: Response) {
    try {
        const reputation = await getCreatorReputation(String(req.params.id));
        res.json(reputation);
    } catch {
        res.status(404).json({ error: { code: "CREATOR_NOT_FOUND", message: "Creator not found" } });
    }
}