import { notFound } from "next/navigation";
import { getCreatorProfile, listAssets, getCreatorReputation } from "@/lib/api-client";
import { CreatorHero } from "@/components/creator/CreatorHero";
import { CreatorVerificationBadgeCard } from "@/components/creator/CreatorVerificationBadgeCard";
import { CreatorStatsBar } from "@/components/creator/CreatorStatsBar";
import { FeaturedCreationCard } from "@/components/creator/FeaturedCreationCard";
import { CreationsGrid } from "@/components/creator/CreationsGrid";
import { CreatorTimeline } from "@/components/creator/CreatorTimeline";
import { CreatorTrustSection } from "@/components/creator/CreatorTrustSection";
import { DiscoverCreatorsGrid } from "@/components/creator/DiscoverCreatorsGrid";
import { CreatorCtaSection } from "@/components/creator/CreatorCtaSection";
import { ReputationBadge } from "@/components/creator/ReputationBadge";

export default async function CreatorProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const profile = await getCreatorProfile(id);

    if (!profile) {
        notFound();
    }

    const assetsData = await listAssets({ creatorId: id }).catch(() => ({ results: [], total: 0 }));
    const assets = assetsData.results || [];

    const reputation = await getCreatorReputation(id).catch(() => null);

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Grid & Glow */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <CreatorHero
                    displayName={profile.displayName}
                    handle={`@${profile.displayName.toLowerCase().replace(/\s+/g, "_")}`}
                    walletAddress={profile.walletAddress}
                    bio={profile.bio ?? undefined}
                />

                {/* 01b — REAL REPUTATION SUMMARY (score · asset count · review count) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-2 relative z-10">
                    <ReputationBadge creatorId={profile.id} />
                </div>

                {/* 02 — VERIFICATION BADGE */}
                <CreatorVerificationBadgeCard />

                {/* 03 — STATS BAR */}
                <CreatorStatsBar
                    registeredCount={assets.length}
                    verifiedCount={assets.length}
                    reputationScore={reputation?.score ?? 0}
                />

                {/* 04 — FEATURED CREATION (most recently registered asset, or hidden if none) */}
                <FeaturedCreationCard asset={assets[0] ?? null} />

                {/* 05 — REGISTERED CREATIONS */}
                <CreationsGrid assets={assets} />

                {/* 06 — TIMELINE */}
                <CreatorTimeline />

                {/* 07 — TRUST INDICATORS */}
                <CreatorTrustSection assetCount={assets.length} reviewCount={reputation?.reviewCount ?? 0} />

                {/* 08 — DISCOVER OTHER CREATORS */}
                <DiscoverCreatorsGrid />

                {/* 09 — FINAL CTA */}
                <CreatorCtaSection />
            </div>
        </div>
    );
}
