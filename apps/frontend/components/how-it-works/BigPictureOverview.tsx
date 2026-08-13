"use client";

import { motion } from "framer-motion";
import { Upload, FileCode2, ShieldCheck, Database, CheckCircle2, Award, ArrowRight } from "lucide-react";

const OVERVIEW_STEPS = [
    { num: "01", title: "CREATE", desc: "Creator produces digital work & hashes locally", icon: Upload, color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" },
    { num: "02", title: "REGISTER", desc: "Wallet signs EIP-712 structured payload", icon: FileCode2, color: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
    { num: "03", title: "PROVE", desc: "Origin payload converts to SHA-256 proof ID", icon: ShieldCheck, color: "text-violet-400 border-violet-500/40 bg-violet-500/10" },
    { num: "04", title: "RECORD", desc: "Proof anchored to Arbitrum smart contract", icon: Database, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
    { num: "05", title: "VERIFY", desc: "Public zero-auth audit of proof validity", icon: CheckCircle2, color: "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10" },
    { num: "06", title: "TRUST", desc: "Decentralized immutable origin provenance", icon: Award, color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
];

export function BigPictureOverview() {
    return (
        <section className="py-16 relative bg-transparent overflow-hidden border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        AT A GLANCE
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        How a Proof is Created
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {OVERVIEW_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`relative p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-between h-48 ${step.color}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-8 h-8 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-zinc-500">{step.num}</span>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold font-mono text-white tracking-wider mb-1 uppercase">
                                        {step.title}
                                    </h3>
                                    <p className="text-[11px] text-zinc-400 leading-snug">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
