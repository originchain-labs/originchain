"use client";

import { useEffect, useState } from "react";
import { Blockchain3DCameraCanvas } from "@/components/landing/Blockchain3DCameraCanvas";
import { ScrollIndicator } from "@/components/landing/ScrollIndicator";
import { HeroSection } from "@/components/landing/HeroSection";
import { WhatIsSection } from "@/components/landing/WhatIsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ProofOfOriginSection } from "@/components/landing/ProofOfOriginSection";

import { ExploreAssetsSection } from "@/components/landing/ExploreAssetsSection";
import { ReputationSection } from "@/components/landing/ReputationSection";
import { VerificationSection } from "@/components/landing/VerificationSection";
import { WhyOriginChainSection } from "@/components/landing/WhyOriginChainSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Mouse Parallax normalized tracking
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
      {/* Scroll-Driven 3D Blockchain Camera Canvas (Fixed background) */}
      <Blockchain3DCameraCanvas mousePos={mousePos} reducedMotion={reducedMotion} />

      {/* Top Progress & Hero Scroll Indicator */}
      <ScrollIndicator />

      {/* Interactive Storytelling Overlay Sections */}
      <div className="relative z-10 space-y-0">
        {/* 02 — HERO */}
        <HeroSection />

        {/* 03 — WHAT IS ORIGINCHAIN? */}
        <WhatIsSection />

        {/* 04 — HOW IT WORKS */}
        <HowItWorksSection />

        {/* 06 — PROOF OF ORIGIN */}
        <ProofOfOriginSection />


        {/* 07 — EXPLORE VERIFIED CREATIVITY */}
        <ExploreAssetsSection />

        {/* 08 — CREATOR REPUTATION */}
        <ReputationSection />

        {/* 09 — VERIFICATION */}
        <VerificationSection />

        {/* 10 — WHY ORIGINCHAIN */}
        <WhyOriginChainSection />

        {/* 11 — FINAL CTA */}
        <FinalCtaSection />
      </div>
    </div>
  );
}