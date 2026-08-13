"use client";

import { CreatorVerificationBadgeCard } from "@/components/creator/CreatorVerificationBadgeCard";
import { DiscoverCreatorsGrid } from "@/components/creator/DiscoverCreatorsGrid";
import { CreatorCtaSection } from "@/components/creator/CreatorCtaSection";

export default function CreatorsIndexPage() {
    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Grid & Glow */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 pt-28 pb-12 space-y-4">
                {/* 01 — VERIFICATION BADGE */}
                <CreatorVerificationBadgeCard />

                {/* 02 — DISCOVER CREATORS (real search) */}
                <DiscoverCreatorsGrid />

                {/* 03 — FINAL CTA */}
                <CreatorCtaSection />
            </div>
        </div>
    );
}
