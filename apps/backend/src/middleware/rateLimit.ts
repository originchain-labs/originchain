import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { AuthedRequest } from "./auth.js";

// Scoped to the /prepare endpoint specifically, since that's the only
// route that triggers a real Gemini API call. Keyed by wallet address
// (not raw IP) so it actually limits per-user, not per-network.
export const aiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // 20 AI-assisted prepare calls per hour per wallet
    keyGenerator: (req: AuthedRequest) => {
        if (req.walletAddress) return req.walletAddress;
        return ipKeyGenerator(req.ip || "127.0.0.1");
    },
    validate: { ip: false },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many AI-assisted requests. Please try again later.",
        },
    },
});

// Rate limiter for unauthenticated public read endpoints (200 req per 15 mins per IP)
export const publicRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // 200 requests per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many public requests. Please try again later.",
        },
    },
});

// Rate limiter for review submissions (10 reviews per hour per wallet address)
export const reviewRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // 10 review submissions per hour per wallet
    keyGenerator: (req: AuthedRequest) => {
        if (req.walletAddress) return req.walletAddress;
        return ipKeyGenerator(req.ip || "127.0.0.1");
    },
    validate: { ip: false },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many review submissions. Please try again later.",
        },
    },
});