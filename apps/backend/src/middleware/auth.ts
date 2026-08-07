import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
    walletAddress?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing session token" } });
    }

    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { walletAddress: string };
        req.walletAddress = payload.walletAddress;
        next();
    } catch {
        res.status(401).json({ error: { code: "INVALID_TOKEN", message: "Session token is invalid or expired" } });
    }
}