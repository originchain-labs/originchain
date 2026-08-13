"use client";

import { CreatorHero } from "@/components/creator/CreatorHero";
import { CreatorVerificationBadgeCard } from "@/components/creator/CreatorVerificationBadgeCard";
import { CreatorStatsBar } from "@/components/creator/CreatorStatsBar";
import { FeaturedCreationCard } from "@/components/creator/FeaturedCreationCard";
import { CreationsGrid } from "@/components/creator/CreationsGrid";
import { CreatorTimeline } from "@/components/creator/CreatorTimeline";
import { CreatorTrustSection } from "@/components/creator/CreatorTrustSection";
import { DiscoverCreatorsGrid } from "@/components/creator/DiscoverCreatorsGrid";
import { CreatorCtaSection } from "@/components/creator/CreatorCtaSection";

export default function CreatorsIndexPage() {
    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Grid & Glow */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <CreatorHero
                    displayName="Elena Vance"
                    handle="@cyber_artisan"
                    walletAddress="0x71C789A24F1299B03A911F82"
                    bio="Generative AI artist & Web3 architect establishing verifiable origin provenance on OriginChain."
                />

                {/* 02 — VERIFICATION BADGE */}
                <CreatorVerificationBadgeCard />

                {/* 03 — STATS BAR */}
                <CreatorStatsBar registeredCount={42} verifiedCount={42} reputationScore={99} />

                {/* 04 — FEATURED CREATION (this whole page has no real data source yet - hidden) */}
                <FeaturedCreationCard asset={null} />

                {/* 05 — REGISTERED CREATIONS */}
                <CreationsGrid assets={[]} />

                {/* 06 — TIMELINE */}
                <CreatorTimeline />

                {/* 07 — TRUST INDICATORS */}
                <CreatorTrustSection assetCount={0} reviewCount={0} />

                {/* 08 — DISCOVER OTHER CREATORS */}
                <DiscoverCreatorsGrid />

                {/* 09 — FINAL CTA */}
                <CreatorCtaSection />
            </div>
        </div>
    );
}
