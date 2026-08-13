"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export function ExploreHero() {
    return (
        <section className="relative pt-36 pb-20 overflow-hidden bg-transparent">
            {/* Background Radial Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-violet-600/20 to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Eyebrow Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md shadow-xl"
                >
                    <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                    <span className="font-semibold tracking-wider uppercase">EXPLORE THE CHAIN</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto"
                >
                    Explore the <span className="text-gradient-cyan">OriginChain</span> Ecosystem.
                </motion.h1>

                {/* Supporting Text */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
                >
                    Discover how digital assets move from creation to verification through a decentralized proof-of-origin infrastructure.
                </motion.p>

                {/* Quick Action Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Verification Network</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Arbitrum Smart Contracts</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span>IPFS Decentralized Storage</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
