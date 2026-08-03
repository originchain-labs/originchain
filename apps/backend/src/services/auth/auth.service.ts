import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";
import { createNonce, consumeNonce } from "./nonce-store.js";

const DOMAIN = process.env.APP_DOMAIN || "localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = (process.env.SESSION_TOKEN_EXPIRY || "7d") as NonNullable<jwt.SignOptions["expiresIn"]>;

export function generateNonce(): string {
    return createNonce();
}

export async function verifySiweSignature(message: string, signature: string) {
    const siweMessage = new SiweMessage(message);

    // Bind verification to our expected domain — prevents a signed message
    // crafted for a different origin from being replayed against us.
    if (siweMessage.domain !== DOMAIN) {
        throw new Error("DOMAIN_MISMATCH");
    }

    const result = await siweMessage.verify({ signature }, { suppressExceptions: true });

    if (!result.success) {
        throw new Error("INVALID_SIGNATURE");
    }

    const nonceValid = consumeNonce(siweMessage.nonce);
    if (!nonceValid) {
        throw new Error("NONCE_EXPIRED_OR_USED");
    }

    return siweMessage.address;
}

export function issueSessionToken(walletAddress: string): string {
    return jwt.sign({ walletAddress }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}