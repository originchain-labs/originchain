"use client";

import { useEffect, useState } from "react";
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

export default function CreatorsIndexPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);

        const handleMouseMove = (e: MouseEvent) => {
            if (mediaQuery.matches) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Canvas */}
            <Blockchain3DCameraCanvas mousePos={mousePos} reducedMotion={reducedMotion} />

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

                {/* 04 — FEATURED CREATION */}
                <FeaturedCreationCard />

                {/* 05 — REGISTERED CREATIONS */}
                <CreationsGrid assets={[]} />

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
