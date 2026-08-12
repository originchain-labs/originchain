"use client";

import { useEffect, useState } from "react";
import { Blockchain3DCameraCanvas } from "@/components/landing/Blockchain3DCameraCanvas";
import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { BigPictureOverview } from "@/components/how-it-works/BigPictureOverview";
import { StickyStepNav } from "@/components/how-it-works/StickyStepNav";
import { Step01Creation } from "@/components/how-it-works/Step01Creation";
import { Step02Registration } from "@/components/how-it-works/Step02Registration";
import { Step03ProofGeneration } from "@/components/how-it-works/Step03ProofGeneration";
import { Step04BlockchainRecord } from "@/components/how-it-works/Step04BlockchainRecord";
import { Step05Validation } from "@/components/how-it-works/Step05Validation";
import { Step06Immutability } from "@/components/how-it-works/Step06Immutability";
import { Step07Verification } from "@/components/how-it-works/Step07Verification";
import { EndToEndInteractiveCenterpiece } from "@/components/how-it-works/EndToEndInteractiveCenterpiece";
import { RealWorldStoryExample } from "@/components/how-it-works/RealWorldStoryExample";
import { WhatGetsRecordedSection } from "@/components/how-it-works/WhatGetsRecordedSection";
import { CreatorToVerifierSplit } from "@/components/how-it-works/CreatorToVerifierSplit";
import { HowItWorksCtaSection } from "@/components/how-it-works/HowItWorksCtaSection";

export default function HowItWorksPage() {
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
            {/* Ambient Background Canvas */}
            <Blockchain3DCameraCanvas mousePos={mousePos} reducedMotion={reducedMotion} />

            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <HowItWorksHero />

                {/* 02 — BIG PICTURE OVERVIEW */}
                <BigPictureOverview />

                {/* 03 — STICKY STEP NAV */}
                <StickyStepNav />

                {/* 04 — STEP 01 CREATION */}
                <Step01Creation />

                {/* 05 — STEP 02 REGISTRATION */}
                <Step02Registration />

                {/* 06 — STEP 03 PROOF GENERATION */}
                <Step03ProofGeneration />

                {/* 07 — STEP 04 BLOCKCHAIN RECORD */}
                <Step04BlockchainRecord />

                {/* 08 — STEP 05 VALIDATION */}
                <Step05Validation />

                {/* 09 — STEP 06 PROTECT & IMMUTABILITY */}
                <Step06Immutability />

                {/* 10 — STEP 07 VERIFICATION */}
                <Step07Verification />

                {/* 11 — END-TO-END INTERACTIVE CENTERPIECE */}
                <EndToEndInteractiveCenterpiece />

                {/* 12 — REAL WORLD STORY EXAMPLE */}
                <RealWorldStoryExample />

                {/* 13 — WHAT GETS RECORDED */}
                <WhatGetsRecordedSection />

                {/* 14 — CREATOR TO VERIFIER SPLIT */}
                <CreatorToVerifierSplit />

                {/* 15 — FINAL CTA */}
                <HowItWorksCtaSection />
            </div>
        </div>
    );
}
