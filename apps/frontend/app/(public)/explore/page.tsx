"use client";

import { useEffect, useState } from "react";
import { Blockchain3DCameraCanvas } from "@/components/landing/Blockchain3DCameraCanvas";
import { ExploreHero } from "@/components/explore/ExploreHero";
import { EcosystemNodeGraph } from "@/components/explore/EcosystemNodeGraph";
import { InteractiveLifecycle } from "@/components/explore/InteractiveLifecycle";
import { BlockchainConceptsGrid } from "@/components/explore/BlockchainConceptsGrid";
import { AssetExplorerSection } from "@/components/explore/AssetExplorerSection";
import { ProofTransformationVisual } from "@/components/explore/ProofTransformationVisual";
import { VerificationPreviewCard } from "@/components/explore/VerificationPreviewCard";
import { CreatorEcosystemGrid } from "@/components/explore/CreatorEcosystemGrid";
import { BlockchainNetworkCenterpiece } from "@/components/explore/BlockchainNetworkCenterpiece";
import { ProtocolPillarsSection } from "@/components/explore/ProtocolPillarsSection";
import { ExploreSearchFilter } from "@/components/explore/ExploreSearchFilter";
import { RecentActivityTimeline } from "@/components/explore/RecentActivityTimeline";
import { ExploreCtaSection } from "@/components/explore/ExploreCtaSection";

export default function ExplorePage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener("change", handleMediaChange);

        const handleMouseMove = (e: MouseEvent) => {
            if (mediaQuery.matches) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Global Web3 Dark Ambient Background */}
            <Blockchain3DCameraCanvas mousePos={mousePos} reducedMotion={reducedMotion} />

            {/* Explore Page Sections */}
            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <ExploreHero />

                {/* 02 — SEARCH & DISCOVERY INDEXER */}
                <ExploreSearchFilter />

                {/* 03 — INTERACTIVE NODE GRAPH */}
                <EcosystemNodeGraph />

                {/* 04 — LIFECYCLE JOURNEY */}
                <InteractiveLifecycle />

                {/* 05 — 3D CENTERPIECE VISUALIZATION */}
                <BlockchainNetworkCenterpiece />

                {/* 06 — ASSET EXPLORER & CATEGORIES */}
                <AssetExplorerSection />

                {/* 07 — PROOF TRANSFORMATION PIPELINE */}
                <ProofTransformationVisual />

                {/* 08 — BLOCKCHAIN CONCEPTS ("INSIDE THE CHAIN") */}
                <BlockchainConceptsGrid />

                {/* 09 — VERIFICATION PREVIEW */}
                <VerificationPreviewCard />

                {/* 10 — CREATOR ECOSYSTEM */}
                <CreatorEcosystemGrid />

                {/* 11 — RECENT ACTIVITY FEED */}
                <RecentActivityTimeline />

                {/* 12 — WHY ORIGINCHAIN PROTOCOL PILLARS */}
                <ProtocolPillarsSection />

                {/* 13 — FINAL EXPLORE CTA */}
                <ExploreCtaSection />
            </div>
        </div>
    );
}
