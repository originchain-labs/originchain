"use client";

import { motion } from "framer-motion";
import { Cpu, CheckCircle2 } from "lucide-react";

export function Step05Validation() {
    return (
        <section id="step-05" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-mono">
                            <span>STEP 05 — VALIDATION</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            The Network <span className="text-gradient-cyan">Confirms the Record.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            Validation nodes reach decentralized consensus across the Arbitrum network. Once 128 block confirmations are accumulated, the transaction state becomes mathematically final.
                        </p>
                    </div>

                    {/* Right Visual Mesh */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-fuchsia-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-4 text-center font-mono text-xs"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Cpu className="w-6 h-6 text-fuchsia-400" />
                                <span className="text-white font-bold text-sm">128 VALIDATOR NODES SYNCED</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-emerald-400 font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>CONSENSUS ACHIEVED (100%)</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
