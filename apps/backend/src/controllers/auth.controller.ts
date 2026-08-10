import type { Request, Response } from "express";
import { generateNonce, verifySiweSignature, issueSessionToken } from "../services/auth/auth.service.js";
import { getCreatorByWallet } from "../services/creator.service.js";

export async function getNonce(req: Request, res: Response) {
    const nonce = generateNonce();
    res.json({ nonce });
}

export async function verify(req: Request, res: Response) {
    const { message, signature } = req.body;

    try {
        const walletAddress = await verifySiweSignature(message, signature);
        const token = issueSessionToken(walletAddress);

        const existingCreator = await getCreatorByWallet(walletAddress);

        res.json({
            token,
            creator: existingCreator
                ? { id: existingCreator.id, walletAddress, isNewCreator: false }
                : { walletAddress, isNewCreator: true },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
        const errorMap: Record<string, { status: number; code: string }> = {
            DOMAIN_MISMATCH: { status: 401, code: "INVALID_SIGNATURE" },
            INVALID_SIGNATURE: { status: 401, code: "INVALID_SIGNATURE" },
            NONCE_EXPIRED_OR_USED: { status: 400, code: "NONCE_EXPIRED" },
        };
        const mapped = errorMap[message] || { status: 500, code: "UNKNOWN_ERROR" };
        res.status(mapped.status).json({ error: { code: mapped.code, message } });
    }
}