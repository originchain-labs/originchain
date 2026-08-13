"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Lock, ArrowDown } from "lucide-react";

export function Step03ProofGeneration() {
    return (
        <section id="step-03" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono">
                            <span>STEP 03 — PROOF GENERATION</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Turn Origin Into <span className="text-gradient-violet">Cryptographic Proof.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            Asset metadata and SHA-256 binary hash digest are combined into a standardized Proof Payload. The metadata is pinned to IPFS, generating an immutable content identifier (CID).
                        </p>
                    </div>

                    {/* Right Visual Transformation */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-violet-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md text-center space-y-4 font-mono text-xs"
                        >
                            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-zinc-300">
                                ASSET HASH + CREATOR SIGNATURE
                            </div>

                            <ArrowDown className="w-5 h-5 text-violet-400 mx-auto" />

                            <div className="p-4 rounded-2xl bg-violet-500/20 border border-violet-400/50 text-violet-200 shadow-xl space-y-1">
                                <span className="text-[10px] text-violet-300 font-bold block">CRYPTOGRAPHIC PROOF PAYLOAD</span>
                                <div className="text-emerald-300 font-bold break-all text-[11px]">
                                    QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
