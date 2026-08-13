"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";

export function Step07Verification() {
    return (
        <section id="step-07" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                            <span>STEP 07 — PUBLIC VERIFICATION</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Anyone With the Proof Can <span className="text-gradient-cyan">Verify the Origin.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            No gas fees, login, or wallet connections required. Anyone can enter a SHA-256 hash or Proof ID into the public verification engine to instantly audit creator identity and block state.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/verify"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.02] transition-all"
                            >
                                <ShieldCheck className="w-4 h-4 text-slate-950" />
                                <span>Verify an Asset Now</span>
                                <ArrowRight className="w-4 h-4 text-slate-950" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Preview Card */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-4 font-mono text-xs"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <span className="text-zinc-400">AUDIT VERDICT</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">✓ ORIGIN VERIFIED</span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                                <span className="text-zinc-500 text-[10px]">VERIFIED CREATOR</span>
                                <div className="text-white font-bold">Elena Vance (@cyber_artisan)</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
