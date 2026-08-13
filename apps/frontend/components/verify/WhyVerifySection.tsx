"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Award } from "lucide-react";

const WHY_POINTS = [
    {
        title: "VERIFY ORIGIN",
        desc: "Know exactly where the asset came from and confirm creator identity timestamp signatures.",
        icon: ShieldCheck,
        color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
        title: "CHECK INTEGRITY",
        desc: "Confirm the recorded binary SHA-256 proof hash remains 100% consistent with zero data tampering.",
        icon: Lock,
        color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
        title: "TRACE HISTORY",
        desc: "Understand the full digital journey and IPFS metadata pointers pinned permanently on-chain.",
        icon: Eye,
        color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    },
    {
        title: "BUILD TRUST",
        desc: "Make digital ownership and origin verifiable to buyers, auditors, and global platforms.",
        icon: Award,
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
];

export function WhyVerifySection() {
    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <span>DECENTRALIZED TRUST BENEFITS</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Why <span className="text-gradient-cyan">Verify?</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        In an era of artificial media and synthetic content, verifiable origin is the cornerstone of digital ownership.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_POINTS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`p-6 rounded-2xl border ${item.color} backdrop-blur-md hover:-translate-y-1.5 transition-all shadow-xl`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold font-mono tracking-wider text-white uppercase mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
