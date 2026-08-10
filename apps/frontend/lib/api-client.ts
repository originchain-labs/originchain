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
        creator: { id: string; walletAddress: string; isNewCreator: boolean };
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

export async function verifyAsset(params: { hash?: string; proofId?: string }) {
    const query = new URLSearchParams();
    if (params.hash) query.set("hash", params.hash);
    if (params.proofId) query.set("proofId", params.proofId);

    const res = await fetch(`${API_URL}/api/v1/assets/verify?${query}`);
    if (!res.ok) throw new Error("Verification check failed");
    return res.json() as Promise<{
        verified: boolean;
        asset?: { title: string; contentHash: string; registeredAt: string; txHash: string; proofId: string };
        creatorAddress?: string;
        creatorDisplayName?: string;
    }>;
}

export async function submitReviewToBackend(
    data: { assetId: string; rating: number; comment?: string; txHash: string },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Failed to submit review");
    }
    return res.json();
}

export async function getAssetReviews(assetId: string) {
    const res = await fetch(`${API_URL}/api/v1/assets/${assetId}/reviews`);
    if (!res.ok) throw new Error("Failed to load reviews");
    return res.json() as Promise<{
        results: { rating: number; comment: string | null; createdAt: string; reviewer: { displayName: string; walletAddress: string } }[];
        total: number;
        averageRating: number | null;
    }>;
}

export async function getCreatorReputation(creatorId: string) {
    const res = await fetch(`${API_URL}/api/v1/creators/${creatorId}/reputation`);
    if (!res.ok) throw new Error("Failed to load reputation");
    return res.json() as Promise<{ score: number; assetCount: number; reviewCount: number }>;
}

export async function getCreatorInsights(creatorId: string, token: string) {
    const res = await fetch(`${API_URL}/api/v1/creators/${creatorId}/insights`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load insights");
    return res.json() as Promise<{
        totalAssets: number;
        totalReviews: number;
        averageRating: number | null;
        reputationScore: number;
        assetsOverTime: { date: string; count: number }[];
        reviewsOverTime: { date: string; count: number; averageRating: number }[];
        aiSummary: string | null;
    }>;
}

export async function getCreatorProfile(id: string) {
    const res = await fetch(`${API_URL}/api/v1/creators/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load creator");
    return res.json() as Promise<{
        id: string;
        walletAddress: string;
        displayName: string;
        bio: string | null;
        avatarCid: string | null;
    }>;
}

export async function updateCreatorProfile(
    id: string,
    data: { displayName?: string; bio?: string; avatarCid?: string },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/creators/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
}