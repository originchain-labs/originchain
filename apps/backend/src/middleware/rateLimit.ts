import rateLimit from "express-rate-limit";
import type { AuthedRequest } from "./auth.js";

// Scoped to the /prepare endpoint specifically, since that's the only
// route that triggers a real Gemini API call. Keyed by wallet address
// (not raw IP) so it actually limits per-user, not per-network — several
// users behind the same NAT/office network shouldn't share one bucket.
export const aiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // 20 AI-assisted prepare calls per hour per wallet
    keyGenerator: (req: AuthedRequest) => req.walletAddress || req.ip || "unknown",
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many AI-assisted requests. Please try again later.",
        },
    },
});