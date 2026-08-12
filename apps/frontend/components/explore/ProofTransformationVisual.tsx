"use client";

import { motion } from "framer-motion";
import { FileCode, Sparkles, ShieldCheck, Database, CheckCircle2, ArrowRight } from "lucide-react";

const STAGES = [
    { name: "DIGITAL ASSET", desc: "Raw file input", icon: FileCode, color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" },
    { name: "ORIGIN RECORD", desc: "SHA-256 Digest", icon: Sparkles, color: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
    { name: "CRYPTOGRAPHIC PROOF", desc: "EIP-712 Payload", icon: ShieldCheck, color: "text-violet-400 border-violet-500/40 bg-violet-500/10" },
    { name: "BLOCKCHAIN RECORD", desc: "Arbitrum Log", icon: Database, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
    { name: "VERIFIED ORIGIN", desc: "Audit Certificate", icon: CheckCircle2, color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
];

export function ProofTransformationVisual() {
    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>TRANSFORMATION PIPELINE</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Every Creation Has an <span className="text-gradient-cyan">Origin.</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        Watch how a raw digital creation transforms into an auditable cryptographic proof.
                    </p>
                </div>

                {/* Horizontal Transformation Pipeline Visual */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative items-center">
                    {STAGES.map((stage, idx) => {
                        const Icon = stage.icon;
                        return (
                            <motion.div
                                key={stage.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                className={`relative p-6 rounded-2xl border backdrop-blur-md flex flex-col items-center text-center space-y-3 ${stage.color}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center shadow-lg">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                                    STAGE 0{idx + 1}
                                </span>
                                <h3 className="text-xs font-bold font-mono tracking-wider text-white">
                                    {stage.name}
                                </h3>
                                <p className="text-[11px] text-zinc-400 font-mono">
                                    {stage.desc}
                                </p>

                                {idx < STAGES.length - 1 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                                        <div className="w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                            <ArrowRight className="w-3 h-3" />
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
