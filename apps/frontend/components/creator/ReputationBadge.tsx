"use client";

import { useReputation } from "@/hooks/useReputation";

export function ReputationBadge({ creatorId }: { creatorId: string }) {
    const { reputation, loading, error } = useReputation(creatorId);

    if (error) return null; // degrade silently — reputation is supplementary info, never block the page
    if (loading || !reputation) return <span className="text-xs text-zinc-400">Loading reputation…</span>;

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