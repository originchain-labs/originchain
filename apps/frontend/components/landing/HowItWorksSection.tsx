"use client";

import { motion } from "framer-motion";
import { Upload, FileCode2, Cpu, HardDrive, ShieldCheck, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
    const timelineSteps = [
        {
            num: "01",
            title: "CREATE",
            subtitle: "Upload Asset",
            desc: "Select your digital creation file (image, audio, document, code).",
            icon: Upload,
        },
        {
            num: "02",
            title: "HASH",
            subtitle: "Cryptographic Fingerprint",
            desc: "Generate an immutable SHA-256 hash locally in your browser.",
            icon: FileCode2,
        },
        {
            num: "03",
            title: "AI METADATA",
            subtitle: "Smart Enrichment",
            desc: "Automatic AI metadata suggestions for tags, description, and categorization.",
            icon: Cpu,
        },
        {
            num: "04",
            title: "IPFS",
            subtitle: "Decentralized Storage",
            desc: "Metadata is securely pinned to IPFS for permanent decentralized access.",
            icon: HardDrive,
        },
        {
            num: "05",
            title: "REGISTER",
            subtitle: "On-Chain Smart Contract",
            desc: "Submit on-chain transaction to bind ownership and content hash permanently.",
            icon: ShieldCheck,
        },
        {
            num: "06",
            title: "VERIFY",
            subtitle: "Public Verification",
            desc: "Generate proof certificate and enable public cryptographic auditing.",
            icon: CheckCircle,
        },
    ];

    return (
        <section id="how-it-works" className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono"
                    >
                        <span>END-TO-END PROCESS</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        From Creation to <span className="text-gradient-violet">Proof.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                    >
                        How OriginChain registers, enriches, pins, and seals digital assets onto the blockchain.
                    </motion.p>
                </div>

                {/* Timeline Layout */}
                <div className="relative">
                    {/* Desktop Connecting Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-violet-500/40 to-emerald-500/20 -translate-y-12 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
                        {timelineSteps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="flex flex-col items-start bg-slate-900/60 rounded-2xl border border-white/10 hover:border-violet-500/40 p-6 backdrop-blur-md hover:-translate-y-2 transition-all shadow-xl group"
                                >
                                    {/* Step Header */}
                                    <div className="w-full flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-slate-950 transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xl font-bold font-mono text-zinc-600 group-hover:text-violet-400 transition-colors">
                                            {step.num}
                                        </span>
                                    </div>

                                    {/* Step Title & Subtitle */}
                                    <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase mb-1">
                                        {step.title}
                                    </span>
                                    <h3 className="text-base font-bold text-white mb-2">{step.subtitle}</h3>

                                    {/* Description */}
                                    <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
