"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck, Link2 } from "lucide-react";

export function Step06Immutability() {
    return (
        <section id="step-06" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono">
                            <span>STEP 06 — PROTECT & IMMUTABILITY</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            A Record Designed to <span className="text-gradient-amber">Resist Silent Changes.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            Each block is cryptographically linked to the previous block&apos;s parent hash. Any attempt to modify a historical record breaks the cryptographic chain, making silent tampering impossible.
                        </p>
                    </div>

                    {/* Right Visual Block Chaining */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-3 font-mono text-xs text-center"
                        >
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 font-bold">
                                    BLOCK N-1
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold">
                                    BLOCK N
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold">
                                    BLOCK N+1
                                </div>
                            </div>
                            <span className="text-[11px] text-zinc-400 block pt-2">
                                Parent Hash Cryptographic Linkage Verified
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
