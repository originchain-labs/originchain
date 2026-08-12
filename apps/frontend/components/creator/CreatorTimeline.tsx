"use client";

import { motion } from "framer-motion";
import { UserCheck, Upload, ShieldCheck, CheckCircle2 } from "lucide-react";

const TIMELINE = [
    { year: "2026 Q3", title: "Asset Verified On-Chain", desc: "Quantum Genesis Canvas #04 verified by public auditor.", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { year: "2026 Q2", title: "Proof Payload Sealed", desc: "Generated EIP-712 domain proof ID #OC-891042.", icon: ShieldCheck, color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
    { year: "2026 Q2", title: "First Creation Registered", desc: "Uploaded binary SHA-256 fingerprint digest to Arbitrum.", icon: Upload, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { year: "2026 Q1", title: "Joined OriginChain Network", desc: "Authenticated identity with SIWE wallet signature.", icon: UserCheck, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
];

export function CreatorTimeline() {
    return (
        <section className="py-12 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="space-y-4 mb-8">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        PROVENANCE MILESTONES
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">Creation History Timeline</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TIMELINE.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className={`p-6 rounded-2xl border ${item.color} backdrop-blur-md space-y-2`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-zinc-400">{item.year}</span>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-white font-mono">{item.title}</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed font-mono">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
