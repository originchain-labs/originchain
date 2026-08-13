"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Award, Lock } from "lucide-react";

export function CreatorTrustSection() {
    const indicators = [
        { title: "VERIFIED CREATIONS", val: "21 Assets", desc: "21 registered assets have completed on-chain origin verification.", icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
        { title: "PROOF COMPLETION", val: "100%", desc: "100% of proof certificates contain valid SHA-256 digests and IPFS CIDs.", icon: Award, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
        { title: "ON-CHAIN HISTORY", val: "Arbitrum", desc: "Transactions anchored directly to Arbitrum Sepolia smart contracts.", icon: Lock, color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
    ];

    return (
        <section className="py-12 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        TRANSPARENT REPUTATION EVIDENCE
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">Creator Trust Indicators</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {indicators.map((ind, idx) => {
                        const Icon = ind.icon;
                        return (
                            <motion.div
                                key={ind.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`p-6 rounded-2xl border ${ind.color} backdrop-blur-md space-y-3 font-mono text-xs`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white uppercase">{ind.title}</span>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-extrabold text-white">{ind.val}</div>
                                <p className="text-zinc-400 leading-relaxed">{ind.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
