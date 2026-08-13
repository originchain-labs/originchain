"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Share2, UserCheck, CheckCircle2 } from "lucide-react";

const PILLARS = [
    {
        title: "PROVABLE ORIGIN",
        desc: "Every asset has a verifiable origin timestamped and signed by its creator.",
        icon: ShieldCheck,
        color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
        title: "IMMUTABLE RECORDS",
        desc: "Proof payloads written to Arbitrum smart contracts cannot be retroactively altered.",
        icon: Lock,
        color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
        title: "TRANSPARENT HISTORY",
        desc: "Trace the full digital journey and IPFS metadata pointers of any asset globally.",
        icon: Eye,
        color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    },
    {
        title: "DECENTRALIZED TRUST",
        desc: "Verification relies on distributed consensus nodes rather than a single corporate database.",
        icon: Share2,
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
        title: "CREATOR OWNERSHIP",
        desc: "Creators maintain permanent wallet identity credit and on-chain reputation for their work.",
        icon: UserCheck,
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
        title: "INSTANT VERIFICATION",
        desc: "Verify an asset's origin instantly via SHA-256 hash or Proof ID with zero gas fees.",
        icon: CheckCircle2,
        color: "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10",
    },
];

export function ProtocolPillarsSection() {
    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <span>CORE PROTOCOL ADVANTAGES</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Why <span className="text-gradient-cyan">OriginChain?</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        Engineered for absolute trust, decentralized longevity, and zero-effort public verification.
                    </p>
                </div>

                {/* 6 Feature Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className={`p-6 rounded-2xl border ${pillar.color} backdrop-blur-md hover:-translate-y-1.5 transition-all shadow-xl group`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-sm font-bold font-mono tracking-wider text-white uppercase mb-2">
                                    {pillar.title}
                                </h3>

                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
