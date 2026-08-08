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

export async function prepareAsset(file: File, title: string, description: string, token: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    const res = await fetch(`${API_URL}/api/v1/assets/prepare`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (!res.ok) throw new Error("Failed to prepare asset");
    return res.json() as Promise<{
        contentHash: string;
        ipfsCid: string;
        suggestedMetadata: { title: string; description: string; tags: string[] } | null;
    }>;
}

export async function finalizeAssetMetadata(
    metadata: { title: string; description?: string; tags?: string[] },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/assets/finalize-metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(metadata),
    });
    if (!res.ok) throw new Error("Failed to finalize metadata");
    return res.json() as Promise<{ metadataCid: string }>;
}

export async function confirmAssetRegistration(
    data: {
        contentHash: string;
        ipfsCid: string;
        metadataCid: string;
        txHash: string;
        finalMetadata: { title: string; description?: string; tags?: string[] };
    },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/assets/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to confirm asset");
    return res.json();
}

export async function listAssets(params: { creatorId?: string; q?: string; page?: number } = {}) {
    const query = new URLSearchParams();
    if (params.creatorId) query.set("creatorId", params.creatorId);
    if (params.q) query.set("q", params.q);
    if (params.page) query.set("page", String(params.page));

    const res = await fetch(`${API_URL}/api/v1/assets?${query}`);
    if (!res.ok) throw new Error("Failed to load assets");
    return res.json();
}

export async function getAsset(id: string) {
    const res = await fetch(`${API_URL}/api/v1/assets/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load asset");
    return res.json();
}

export async function getCertificate(id: string) {
    const res = await fetch(`${API_URL}/api/v1/assets/${id}/certificate`);
    if (!res.ok) throw new Error("Failed to load certificate");
    return res.json() as Promise<{ certificateUrl: string; qrCodeUrl: string }>;
}