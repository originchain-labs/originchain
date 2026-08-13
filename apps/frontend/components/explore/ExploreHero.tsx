"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Activity } from "lucide-react";

export function ExploreHero() {
    return (
        <section className="relative pt-36 pb-24 overflow-hidden bg-transparent">
            {/* Background Cyber Glow & Grid Lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-cyan-500/25 via-violet-600/20 to-emerald-500/15 blur-[160px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Eyebrow Pill */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-xl shadow-2xl shadow-cyan-950/50"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                    <span className="font-bold tracking-widest uppercase text-[11px] bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
                        DECENTRALIZED PROOF INFRASTRUCTURE
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto"
                >
                    Verify & Protect Media <br />
                    With <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">Arbitrum Cryptography.</span>
                </motion.h1>

                {/* Supporting Text */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal"
                >
                    OriginChain guarantees proof of authorship with SHA-256 binary fingerprinting, IPFS immutable pin storage, and perceptual anti-plagiarism scanning.
                </motion.p>

                {/* Live Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                >
                    {[
                        { label: "BLOCKCHAIN NETWORK", val: "Arbitrum Sepolia", icon: Cpu, color: "text-cyan-400 border-cyan-500/30" },
                        { label: "PROOF FINGERPRINT", val: "SHA-256 Dual-Hash", icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/30" },
                        { label: "DECENTRALIZED PINS", val: "IPFS Cluster v1", icon: Zap, color: "text-violet-400 border-violet-500/30" },
                        { label: "VERIFICATION SPEED", val: "< 120ms Instant", icon: Activity, color: "text-amber-400 border-amber-500/30" },
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition-all text-left group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">{stat.label}</span>
                                    <Icon className={`w-4 h-4 ${stat.color.split(" ")[0]}`} />
                                </div>
                                <div className="text-sm font-extrabold font-mono text-white group-hover:text-cyan-300 transition-colors">
                                    {stat.val}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
