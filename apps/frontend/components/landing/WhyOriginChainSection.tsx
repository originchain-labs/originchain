"use client";

import { motion } from "framer-motion";
import { Shield, Lock, HardDrive, CheckCircle2 } from "lucide-react";

export function WhyOriginChainSection() {
    const pillars = [
        {
            title: "PROOF OF ORIGIN",
            desc: "Establish verifiable provenance for creative work through cryptographic signatures.",
            icon: Shield,
            color: "from-cyan-500/20 to-blue-500/20",
            textColor: "text-cyan-400",
            borderColor: "border-cyan-500/30",
        },
        {
            title: "IMMUTABLE RECORD",
            desc: "Create permanent, tamper-proof blockchain records on Arbitrum smart contracts.",
            icon: Lock,
            color: "from-blue-500/20 to-violet-500/20",
            textColor: "text-blue-400",
            borderColor: "border-blue-500/30",
        },
        {
            title: "DECENTRALIZED STORAGE",
            desc: "Preserve metadata and content fingerprints indefinitely using IPFS infrastructure.",
            icon: HardDrive,
            color: "from-violet-500/20 to-fuchsia-500/20",
            textColor: "text-violet-400",
            borderColor: "border-violet-500/30",
        },
        {
            title: "PUBLIC VERIFICATION",
            desc: "Allow anyone to audit and verify registered proof without wallet authentication.",
            icon: CheckCircle2,
            color: "from-emerald-500/20 to-teal-500/20",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/30",
        },
    ];

    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <span>CORE PROTOCOL PILLARS</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Why <span className="text-gradient-cyan">OriginChain?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                    >
                        Engineered for absolute trust, decentralized longevity, and effortless verification.
                    </motion.p>
                </div>

                {/* 4 Feature Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`p-6 rounded-2xl bg-slate-900/60 border ${pillar.borderColor} hover:border-cyan-400 backdrop-blur-md hover:-translate-y-1.5 transition-all shadow-xl group`}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} border border-white/10 flex items-center justify-center ${pillar.textColor} mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <h3 className={`text-sm font-bold font-mono ${pillar.textColor} tracking-wider uppercase mb-2`}>
                                    {pillar.title}
                                </h3>

                                <p className="text-xs text-zinc-400 leading-relaxed">
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
