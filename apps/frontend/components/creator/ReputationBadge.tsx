"use client";

import { useReputation } from "@/hooks/useReputation";

export function ReputationBadge({ creatorId }: { creatorId: string }) {
    const { reputation, loading, error } = useReputation(creatorId);

    if (error) return null; // degrade silently — reputation is supplementary info, never block the page
    if (loading || !reputation) return <span className="text-xs text-zinc-400 font-mono">Loading reputation…</span>;

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-zinc-400 font-mono backdrop-blur-md">
            <span className="font-bold text-cyan-300">{reputation.score}</span>
            <span className="text-zinc-600">·</span>
            <span>{reputation.assetCount} asset{reputation.assetCount !== 1 ? "s" : ""}</span>
            <span className="text-zinc-600">·</span>
            <span>{reputation.reviewCount} review{reputation.reviewCount !== 1 ? "s" : ""}</span>
        </div>
    );
}