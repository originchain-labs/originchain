"use client";

import { useState, useEffect } from "react";
import { getCreatorReputation } from "@/lib/api-client";

export function ReputationBadge({ creatorId }: { creatorId: string }) {
    const [reputation, setReputation] = useState<Awaited<ReturnType<typeof getCreatorReputation>> | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        getCreatorReputation(creatorId)
            .then(setReputation)
            .catch(() => setError(true));
    }, [creatorId]);

    if (error) return null; // degrade silently — reputation is supplementary info, never block the page
    if (!reputation) return <span className="text-xs text-zinc-400">Loading reputation…</span>;

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600">
            <span className="font-medium text-zinc-900">{reputation.score}</span>
            <span className="text-zinc-400">·</span>
            <span>{reputation.assetCount} asset{reputation.assetCount !== 1 ? "s" : ""}</span>
            <span className="text-zinc-400">·</span>
            <span>{reputation.reviewCount} review{reputation.reviewCount !== 1 ? "s" : ""}</span>
        </div>
    );
}