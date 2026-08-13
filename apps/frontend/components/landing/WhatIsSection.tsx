"use client";

import { motion } from "framer-motion";
import { Sparkles, Hash, ShieldAlert, CheckCircle2, Award, ArrowRight } from "lucide-react";

export function WhatIsSection() {
    const steps = [
        {
            name: "CREATE",
            title: "Original Work",
            desc: "Upload art, code, documents or digital media.",
            icon: Sparkles,
            color: "from-cyan-500 to-blue-500",
            textColor: "text-cyan-400",
            borderColor: "border-cyan-500/30",
        },
        {
            name: "HASH",
            title: "Digital Fingerprint",
            desc: "Cryptographic SHA-256 hash created instantly.",
            icon: Hash,
            color: "from-blue-500 to-indigo-500",
            textColor: "text-blue-400",
            borderColor: "border-blue-500/30",
        },
        {
            name: "REGISTER",
            title: "On-Chain Record",
            desc: "Smart contracts log ownership permanently.",
            icon: ShieldAlert,
            color: "from-indigo-500 to-violet-500",
            textColor: "text-indigo-400",
            borderColor: "border-indigo-500/30",
        },
        {
            name: "VERIFY",
            title: "Public Audit",
            desc: "Anyone can verify proof without a wallet.",
            icon: CheckCircle2,
            color: "from-violet-500 to-fuchsia-500",
            textColor: "text-violet-400",
            borderColor: "border-violet-500/30",
        },
        {
            name: "PROVE",
            title: "Proof Certificate",
            desc: "Verifiable origin badge backed by blockchain.",
            icon: Award,
            color: "from-fuchsia-500 to-emerald-500",
            textColor: "text-emerald-400",
            borderColor: "border-emerald-500/30",
        },
    ];

    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <span>WHAT IS ORIGINCHAIN?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Every Creation Has an <span className="text-gradient-cyan">Origin.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                    >
                        OriginChain connects creative work to verifiable digital proof, creating a transparent path from creation to blockchain-backed verification.
                    </motion.p>
                </div>

                {/* 5-Step Visual Journey Path */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.name}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 backdrop-blur-sm group hover:-translate-y-1.5 transition-all shadow-xl"
                            >
                                {/* Step Tag */}
                                <span className={`text-[11px] font-mono font-bold ${step.textColor} tracking-widest uppercase mb-3`}>
                                    0{idx + 1} — {step.name}
                                </span>

                                {/* Icon Circle */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform mb-4`}>
                                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                                        <Icon className={`w-6 h-6 ${step.textColor}`} />
                                    </div>
                                </div>

                                {/* Step Title */}
                                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>

                                {/* Step Description */}
                                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>

                                {/* Connector Arrow for Desktop */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                                        <div className="w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
