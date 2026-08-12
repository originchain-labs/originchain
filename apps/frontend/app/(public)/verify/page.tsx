"use client";

import { useEffect, useState } from "react";
import { Blockchain3DCameraCanvas } from "@/components/landing/Blockchain3DCameraCanvas";
import { VerifyHero } from "@/components/verify/VerifyHero";
import { MainVerifyInterface } from "@/components/verify/MainVerifyInterface";
import { VerificationResultDetails } from "@/components/verify/VerificationResultDetails";
import { RecentVerificationsFeed } from "@/components/verify/RecentVerificationsFeed";
import { WhyVerifySection } from "@/components/verify/WhyVerifySection";
import { VerifyCtaSection } from "@/components/verify/VerifyCtaSection";

export default function VerifyPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [reducedMotion, setReducedMotion] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");

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

    const handleResult = (res: any, queryStr: string) => {
        setVerificationResult(res);
        setCurrentQuery(queryStr);
    };

    const handleReset = () => {
        setVerificationResult(null);
        setCurrentQuery("");
    };

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Background Canvas */}
            <Blockchain3DCameraCanvas mousePos={mousePos} reducedMotion={reducedMotion} />

            <div className="relative z-10 space-y-0">
                {/* 01 — HERO */}
                <VerifyHero />

                {/* 02 — MAIN VERIFICATION INTERFACE & RESULT DETAILS */}
                {!verificationResult ? (
                    <MainVerifyInterface onVerificationResult={handleResult} />
                ) : (
                    <VerificationResultDetails
                        result={verificationResult}
                        queryStr={currentQuery}
                        onReset={handleReset}
                    />
                )}

                {/* 03 — RECENT VERIFICATIONS FEED */}
                <RecentVerificationsFeed />

                {/* 04 — WHY VERIFY */}
                <WhyVerifySection />

                {/* 05 — FINAL CTA */}
                <VerifyCtaSection />
            </div>
        </div>
    );
}