"use client";

import { ExploreHero } from "@/components/explore/ExploreHero";
import { EcosystemNodeGraph } from "@/components/explore/EcosystemNodeGraph";
import { InteractiveLifecycle } from "@/components/explore/InteractiveLifecycle";
import { BlockchainConceptsGrid } from "@/components/explore/BlockchainConceptsGrid";
import { AssetExplorerSection } from "@/components/explore/AssetExplorerSection";
import { ProofTransformationVisual } from "@/components/explore/ProofTransformationVisual";
import { VerificationPreviewCard } from "@/components/explore/VerificationPreviewCard";
import { BlockchainNetworkCenterpiece } from "@/components/explore/BlockchainNetworkCenterpiece";
import { ProtocolPillarsSection } from "@/components/explore/ProtocolPillarsSection";
import { ExploreSearchFilter } from "@/components/explore/ExploreSearchFilter";
import { RecentActivityTimeline } from "@/components/explore/RecentActivityTimeline";
import { ExploreCtaSection } from "@/components/explore/ExploreCtaSection";

export default function ExplorePage() {
    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Global Web3 Dark Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

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

                {/* 10 — CREATOR ECOSYSTEM: omitted, no real "browse/list creators" backend
                     capability exists to back this section honestly (see DiscoverCreatorsGrid
                     fix for the same constraint) */}

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
