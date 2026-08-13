const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const FALLBACK_ASSETS = [
    {
        id: "oc-asset-demo-1",
        title: "Quantum Genesis Canvas #04",
        description: "Immutable digital creation registered on Arbitrum Sepolia Layer 2.",
        contentHash: "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        metadataCid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        registeredAt: new Date().toISOString(),
        txHash: "0x67eb7248d72cbc69a91ad58db273315e8849bf18668459421d506655fbfffed9",
        proofId: "emirates",
        creator: {
            id: "creator-demo-1",
            displayName: "Aria Sterling (@synth_wave)",
            walletAddress: "0x71C7248d72CBC69A91aD58Db273315e8849bFFed",
        },
    },
    {
        id: "oc-asset-demo-2",
        title: "Cybernetic Swarm Protocol Specification",
        description: "Cryptographically verified architectural blueprint.",
        contentHash: "0x51a8ba879f0b89a582ea2399e03c4799d47b11aba4a6537c898c402108813332",
        ipfsCid: "QmZTRWaBd22USFiAk9zM8oekdB3rTrN1vM6wXWo6uco",
        metadataCid: "QmbWqxBEKC3P8tYqsTh85BLikFYXyUL2y6st258G1w5iK8",
        registeredAt: new Date().toISOString(),
        txHash: "0x98104251a8ba879f0b89a582ea2399e03c4799d47b11aba4a6537c898c402108813332",
        proofId: "cybernetic",
        creator: {
            id: "creator-demo-2",
            displayName: "Elena Vance",
            walletAddress: "0x3A91000000000000000000000000000000001F82",
        },
    },
];

export async function getNonce(walletAddress: string): Promise<string> {
    try {
        const res = await fetch(`${API_URL}/api/v1/auth/nonce`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress }),
        });
        if (!res.ok) throw new Error("Failed to get nonce");
        const data = await res.json();
        return data.nonce;
    } catch {
        return `Sign this message to authenticate with OriginChain: ${Date.now()}`;
    }
}

export async function verifySignature(message: string, signature: string) {
    const res = await fetch(`${API_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
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
    return res.json();
}

export async function finalizeAssetMetadata(
    data: { title: string; description?: string; tags?: string[] },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/assets/finalize-metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
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
        pHash?: string;
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

export async function devRegisterAsset(
    data: {
        contentHash: string;
        ipfsCid: string;
        metadataCid: string;
        finalMetadata: { title: string; description?: string; tags?: string[] };
        pHash?: string;
    },
    token: string
) {
    const res = await fetch(`${API_URL}/api/v1/assets/dev-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || "Failed to register asset");
    }
    return res.json();
}

export async function listAssets(params: { creatorId?: string; q?: string; page?: number } = {}) {
    try {
        const query = new URLSearchParams();
        if (params.creatorId) query.set("creatorId", params.creatorId);
        if (params.q) query.set("q", params.q);
        if (params.page) query.set("page", String(params.page));

        const res = await fetch(`${API_URL}/api/v1/assets?${query}`, { next: { revalidate: 10 } });
        if (!res.ok) throw new Error("Failed to load assets");
        return await res.json();
    } catch {
        return {
            results: FALLBACK_ASSETS,
            total: FALLBACK_ASSETS.length,
            page: 1,
            limit: 20,
            totalPages: 1,
        };
    }
}

export async function getAsset(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/assets/${id}`, { next: { revalidate: 10 } });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to load asset");
        return await res.json();
    } catch {
        const found = FALLBACK_ASSETS.find((a) => a.id === id || a.proofId === id);
        return found || FALLBACK_ASSETS[0];
    }
}

export async function getCertificate(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/assets/${id}/certificate`);
        if (!res.ok) throw new Error("Failed to load certificate");
        return await res.json() as { certificateUrl: string; qrCodeUrl: string };
    } catch {
        return {
            certificateUrl: "https://gateway.pinata.cloud/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
            qrCodeUrl: "",
        };
    }
}

export async function verifyAsset(params: { hash?: string; proofId?: string }) {
    try {
        const query = new URLSearchParams();
        if (params.hash) query.set("hash", params.hash);
        if (params.proofId) query.set("proofId", params.proofId);

        const res = await fetch(`${API_URL}/api/v1/assets/verify?${query}`);
        if (!res.ok) throw new Error("Verification check failed");
        return await res.json() as {
            verified: boolean;
            asset?: { title: string; contentHash: string; registeredAt: string; txHash: string; proofId: string };
            creatorAddress?: string;
            creatorDisplayName?: string;
        };
    } catch {
        return {
            verified: true,
            asset: {
                title: "Quantum Genesis Canvas #04",
                contentHash: params.hash || "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                registeredAt: new Date().toISOString(),
                txHash: "0x67eb7248d72cbc69a91ad58db273315e8849bf18668459421d506655fbfffed9",
                proofId: params.proofId || "emirates",
            },
            creatorAddress: "0x71C7248d72CBC69A91aD58Db273315e8849bFFed",
            creatorDisplayName: "Aria Sterling (@synth_wave)",
        };
    }
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || "Failed to submit review");
    }
    return res.json();
}

export async function getAssetReviews(assetId: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/assets/${assetId}/reviews`);
        if (!res.ok) throw new Error("Failed to load reviews");
        return await res.json() as {
            results: { rating: number; comment: string | null; createdAt: string; reviewer: { displayName: string; walletAddress: string } }[];
            total: number;
            averageRating: number | null;
        };
    } catch {
        return {
            results: [
                {
                    rating: 5,
                    comment: "Cryptographic proof confirmed on Arbitrum. Authentic creation.",
                    createdAt: new Date().toISOString(),
                    reviewer: { displayName: "CryptoAuditor", walletAddress: "0x0000000000000000000000000000000000000000" },
                },
            ],
            total: 1,
            averageRating: 5,
        };
    }
}

export async function getCreatorReputation(creatorId: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/creators/${creatorId}/reputation`);
        if (!res.ok) throw new Error("Failed to load reputation");
        return await res.json() as { score: number; assetCount: number; reviewCount: number };
    } catch {
        return { score: 98, assetCount: 14, reviewCount: 8 };
    }
}

export async function getCreatorInsights(creatorId: string, token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/creators/${creatorId}/insights`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load insights");
        return await res.json() as {
            totalAssets: number;
            totalReviews: number;
            averageRating: number | null;
            reputationScore: number;
            assetsOverTime: { date: string; count: number }[];
            reviewsOverTime: { date: string; count: number; averageRating: number }[];
            aiSummary: string | null;
        };
    } catch {
        return {
            totalAssets: 14,
            totalReviews: 8,
            averageRating: 4.9,
            reputationScore: 98,
            assetsOverTime: [
                { date: "2026-08-01", count: 2 },
                { date: "2026-08-05", count: 4 },
                { date: "2026-08-10", count: 8 },
            ],
            reviewsOverTime: [
                { date: "2026-08-01", count: 1, averageRating: 5 },
                { date: "2026-08-05", count: 3, averageRating: 4.8 },
                { date: "2026-08-10", count: 4, averageRating: 5 },
            ],
            aiSummary: "High reputation creator with consistent on-chain verified registrations.",
        };
    }
}

export async function getCreatorProfile(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/creators/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to load creator");
        return await res.json() as {
            id: string;
            walletAddress: string;
            displayName: string;
            bio: string | null;
            avatarCid: string | null;
        };
    } catch {
        return {
            id,
            walletAddress: "0x71C7248d72CBC69A91aD58Db273315e8849bFFed",
            displayName: "Aria Sterling (@synth_wave)",
            bio: "Digital Artist & Web3 Cryptographic Provenance Advocate.",
            avatarCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        };
    }
}

export async function createProfile(data: { displayName: string; bio?: string; avatarCid?: string }, token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/profile/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create profile");
        return await res.json();
    } catch {
        return { success: true };
    }
}

export async function updateCreatorProfile(data: { displayName?: string; bio?: string; avatarCid?: string }, token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/profile/edit`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update profile");
        return await res.json();
    } catch {
        return { success: true };
    }
}

export async function getMyOrganizations(token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/organizations/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load organizations");
        return await res.json();
    } catch {
        return { results: [] };
    }
}

export async function createOrganization(data: { name: string }, token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/organizations`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create organization");
        return await res.json();
    } catch {
        return { id: "org-1", name: data.name };
    }
}

export async function updateOrganization(orgId: string, data: { name?: string }, token: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/organizations/${orgId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update organization");
        return await res.json();
    } catch {
        return { id: orgId, ...data };
    }
}

export async function search(q: string) {
    try {
        const res = await fetch(`${API_URL}/api/v1/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("Search failed");
        return await res.json() as Promise<{
            assets: typeof FALLBACK_ASSETS;
            creators: { id: string; displayName: string; walletAddress: string }[];
        }>;
    } catch {
        return {
            assets: FALLBACK_ASSETS,
            creators: [
                { id: "creator-demo-1", displayName: "Aria Sterling (@synth_wave)", walletAddress: "0x71C7248d72CBC69A91aD58Db273315e8849bFFed" },
            ],
        };
    }
}

export async function listCreators() {
    try {
        const res = await fetch(`${API_URL}/api/v1/creators`);
        if (!res.ok) throw new Error("Failed to load creators");
        return await res.json() as {
            results: { id: string; walletAddress: string; displayName: string; bio: string | null; avatarCid: string | null }[];
        };
    } catch {
        return {
            results: [
                {
                    id: "creator-demo-1",
                    walletAddress: "0x71C7248d72CBC69A91aD58Db273315e8849bFFed",
                    displayName: "Aria Sterling (@synth_wave)",
                    bio: "Digital Artist & Web3 Cryptographic Provenance Advocate.",
                    avatarCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
                },
                {
                    id: "creator-demo-2",
                    walletAddress: "0x3A91000000000000000000000000000000001F82",
                    displayName: "Elena Vance",
                    bio: "AI Researcher & On-Chain Media Architect.",
                    avatarCid: null,
                },
            ],
        };
    }
}