interface NonceEntry {
    nonce: string;
    expiresAt: number;
    used: boolean;
}

const NONCE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes, per PROJECT_CHECKLIST.md security requirement

const store = new Map<string, NonceEntry>();

export function createNonce(): string {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    store.set(nonce, {
        nonce,
        expiresAt: Date.now() + NONCE_EXPIRY_MS,
        used: false,
    });
    return nonce;
}

export function consumeNonce(nonce: string): boolean {
    const entry = store.get(nonce);
    if (!entry) return false;
    if (entry.used) return false;
    if (Date.now() > entry.expiresAt) {
        store.delete(nonce);
        return false;
    }
    entry.used = true;
    store.delete(nonce); // single-use: remove immediately after consuming
    return true;
}

// Periodic cleanup of expired-but-unconsumed nonces to avoid unbounded memory growth
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.expiresAt) store.delete(key);
    }
}, 60 * 1000).unref();