"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Star, Activity, Sparkles, TrendingUp, ArrowDown } from "lucide-react";

export function ReputationSection() {
    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono"
                    >
                        <Award className="w-3.5 h-3.5" />
                        <span>DECENTRALIZED REPUTATION SCORE</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Proof Builds <span className="text-gradient-violet">Reputation.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                    >
                        Build a reputation backed by registered work and on-chain activity.
                    </motion.p>
                </div>

                {/* Cards Grid — no plus/equal signs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {/* Item 1: Registered Assets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-3 backdrop-blur-md shadow-xl hover:border-cyan-400/50 hover:shadow-cyan-500/10 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                            REGISTERED ASSETS
                        </h3>
                        <p className="text-xs text-zinc-400">Verifiable original works logged permanently</p>
                    </motion.div>

                    {/* Item 2: Reviews */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-slate-900/60 border border-violet-500/30 text-center space-y-3 backdrop-blur-md shadow-xl hover:border-violet-400/50 hover:shadow-violet-500/10 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 mx-auto flex items-center justify-center">
                            <Star className="w-6 h-6 fill-violet-500/30" />
                        </div>
                        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                            COMMUNITY REVIEWS
                        </h3>
                        <p className="text-xs text-zinc-400">Cryptographically signed peer audits</p>
                    </motion.div>

                    {/* Item 3: On-Chain Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 text-center space-y-3 backdrop-blur-md shadow-xl hover:border-emerald-400/50 hover:shadow-emerald-500/10 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                            ON-CHAIN ACTIVITY
                        </h3>
                        <p className="text-xs text-zinc-400">Transaction history & smart contract interactions</p>
                    </motion.div>
                </div>

                {/* Arrow down + Final Reputation Badge */}
                <div className="mt-10 flex flex-col items-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="w-10 h-10 rounded-full bg-slate-800/60 border border-white/10 flex items-center justify-center"
                    >
                        <ArrowDown className="w-4 h-4 text-zinc-400" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 flex flex-col sm:flex-row items-center gap-6 max-w-xl w-full"
                    >
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-white font-mono">
                                <span className="text-2xl font-black text-cyan-300">98</span>
                                <span className="text-[9px] text-zinc-400">/ 100</span>
                            </div>
                        </div>

                        <div className="text-center sm:text-left space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span>TIER 1 — TRUSTED CREATOR BADGE</span>
                            </div>
                            <h4 className="text-lg font-bold text-white">Verifiable Trust Score</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Automatically computed on-chain based on asset volume, verified hashes, and authentic peer ratings.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
