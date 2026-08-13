"use client";

import { useState } from "react";
import { VerifyHero } from "@/components/verify/VerifyHero";
import { MainVerifyInterface } from "@/components/verify/MainVerifyInterface";
import { VerificationResultDetails } from "@/components/verify/VerificationResultDetails";
import { RecentVerificationsFeed } from "@/components/verify/RecentVerificationsFeed";
import { WhyVerifySection } from "@/components/verify/WhyVerifySection";
import { VerifyCtaSection } from "@/components/verify/VerifyCtaSection";

export default function VerifyPage() {
    const [verificationResult, setVerificationResult] = useState<any | null>(null);
    const [currentQuery, setCurrentQuery] = useState("");

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
            {/* Ambient Background Grid & Glow */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

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