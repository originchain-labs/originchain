"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function CreatorVerificationBadgeCard() {
    return (
        <section className="py-6 relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white font-mono">VERIFIED CREATOR RECORD</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">✓ ACTIVE</span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                This creator has a verifiable record of registered creations and on-chain proof certificates on OriginChain.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-emerald-300">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Identity Record</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> SIWE Verified</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Origin Proofs</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
