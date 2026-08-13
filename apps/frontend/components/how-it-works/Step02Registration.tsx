"use client";

import { motion } from "framer-motion";
import { FileCode2, UserCheck, ShieldCheck, CheckCircle2 } from "lucide-react";

export function Step02Registration() {
    return (
        <section id="step-02" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Visual Card */}
                    <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-blue-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-6"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                                        <FileCode2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-white font-mono">EIP-712 SIGNATURE</span>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">✓ SIGNED</span>
                            </div>

                            <div className="space-y-2 font-mono text-xs text-zinc-300">
                                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between">
                                    <span className="text-zinc-400">Creator:</span>
                                    <span className="text-cyan-300 font-bold">0x71C7...89A2</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between">
                                    <span className="text-zinc-400">Timestamp:</span>
                                    <span className="text-white">2026-08-12 22:25:00 UTC</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between">
                                    <span className="text-zinc-400">Proof ID:</span>
                                    <span className="text-emerald-300 font-bold">#OC-891042</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Copy */}
                    <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
                            <span>STEP 02 — REGISTRATION</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Capture the <span className="text-gradient-cyan">Origin.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            The creator signs an EIP-712 structured domain signature using their Web3 wallet. This binds creator identity, timestamp, and metadata payload irrevocably into an active registration transaction.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
