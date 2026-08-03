const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getNonce(walletAddress: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/v1/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
    });
    if (!res.ok) throw new Error("Failed to get nonce");
    const data = await res.json();
    return data.nonce;
}

export async function verifySignature(message: string, signature: string) {
    const res = await fetch(`${API_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Verification failed");
    }
    return res.json() as Promise<{
        token: string;
        creator: { walletAddress: string; isNewCreator: boolean };
    }>;
}