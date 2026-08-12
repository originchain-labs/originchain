import { notFound } from "next/navigation";
import { getCreatorProfile, listAssets } from "@/lib/api-client";
import { Blockchain3DCameraCanvas } from "@/components/landing/Blockchain3DCameraCanvas";
import { CreatorHero } from "@/components/creator/CreatorHero";
import { CreatorVerificationBadgeCard } from "@/components/creator/CreatorVerificationBadgeCard";
import { CreatorStatsBar } from "@/components/creator/CreatorStatsBar";
import { FeaturedCreationCard } from "@/components/creator/FeaturedCreationCard";
import { CreationsGrid } from "@/components/creator/CreationsGrid";
import { CreatorTimeline } from "@/components/creator/CreatorTimeline";
import { CreatorTrustSection } from "@/components/creator/CreatorTrustSection";
import { DiscoverCreatorsGrid } from "@/components/creator/DiscoverCreatorsGrid";
import { CreatorCtaSection } from "@/components/creator/CreatorCtaSection";

export default async function CreatorProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const profile = await getCreatorProfile(id);

    if (!profile && id !== "creator-1" && id !== "creator-2" && id !== "creator-3") {
        notFound();
    }

    const assetsData = await listAssets({ creatorId: id }).catch(() => ({ results: [], total: 0 }));
    const assets = assetsData.results || [];

    const displayName = profile?.displayName || "Elena Vance";
    const walletAddress = profile?.walletAddress || "0x71C789A24F1299B03A911F82";
    const bio = profile?.bio || "Digital creator building verifiable work and cryptographic proof on OriginChain.";

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Canvas */}
            <Blockchain3DCameraCanvas mousePos={{ x: 0, y: 0 }} reducedMotion={false} />

            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <CreatorHero
                    displayName={displayName}
                    handle={`@${displayName.toLowerCase().replace(/\s+/g, "_")}`}
                    walletAddress={walletAddress}
                    bio={bio}
                />

                {/* 02 — VERIFICATION BADGE */}
                <CreatorVerificationBadgeCard />

                {/* 03 — STATS BAR */}
                <CreatorStatsBar registeredCount={assets.length || 24} verifiedCount={assets.length || 21} reputationScore={98} />

                {/* 04 — FEATURED CREATION */}
                <FeaturedCreationCard />

                {/* 05 — REGISTERED CREATIONS */}
                <CreationsGrid assets={assets} />

                {/* 06 — TIMELINE */}
                <CreatorTimeline />

                {/* 07 — TRUST INDICATORS */}
                <CreatorTrustSection />

                {/* 08 — DISCOVER OTHER CREATORS */}
                <DiscoverCreatorsGrid />

                {/* 09 — FINAL CTA */}
                <CreatorCtaSection />
            </div>
        </div>
    );
}
