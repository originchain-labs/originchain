import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./auth.js";

const adminWallets = (process.env.ADMIN_WALLET_ADDRESSES ?? "")
  .split(",")
  .map((w) => w.trim())
  .filter(Boolean);

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.walletAddress || !adminWallets.includes(req.walletAddress)) {
    return res.status(403).json({ error: { code: "FORBIDDEN", message: "Admin access required" } });
  }
  next();
}
