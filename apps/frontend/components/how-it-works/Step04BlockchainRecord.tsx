"use client";

import { motion } from "framer-motion";
import { Database, ArrowRight } from "lucide-react";

export function Step04BlockchainRecord() {
    return (
        <section id="step-04" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                            <span>STEP 04 — BLOCKCHAIN RECORD</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Anchor the Proof <span className="text-gradient-cyan">On-Chain.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            The proof payload is broadcast to Arbitrum smart contracts in an atomic transaction. A block is mined, permanently embedding the proof into the global distributed ledger.
                        </p>
                    </div>

                    {/* Right Visual Block Connection */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-4 font-mono text-xs text-center"
                        >
                            <div className="flex items-center justify-around gap-2 text-center">
                                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-zinc-400">
                                    PROOF PAYLOAD
                                </div>
                                <ArrowRight className="w-4 h-4 text-emerald-400" />
                                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold">
                                    ARBITRUM BLOCK #948102
                                </div>
                            </div>
                            <span className="text-[11px] text-zinc-400 block pt-2">
                                Transaction Hash: 0x89C4...44D1
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
