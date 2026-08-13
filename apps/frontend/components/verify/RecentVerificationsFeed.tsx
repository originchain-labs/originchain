"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

const RECENT_VERIFICATIONS = [
    {
        title: "Quantum Genesis Canvas #04",
        proofId: "#OC-891042",
        status: "VERIFIED",
        time: "1 min ago",
        block: "#948102",
        creator: "0x71C7...89A2",
    },
    {
        title: "Arbitrum Swarm Smart Contract Spec",
        proofId: "#OC-782194",
        status: "VERIFIED",
        time: "5 mins ago",
        block: "#948098",
        creator: "0x89C4...44D1",
    },
    {
        title: "Sub-Zero Synthesizer Audio Stem",
        proofId: "#OC-651093",
        status: "VERIFIED",
        time: "12 mins ago",
        block: "#948085",
        creator: "0x3A91...1F82",
    },
    {
        title: "Luxury Watch Chronograph Passport",
        proofId: "#OC-541820",
        status: "VERIFIED",
        time: "24 mins ago",
        block: "#948060",
        creator: "0x4F12...99B0",
    },
];

export function RecentVerificationsFeed() {
    return (
        <section className="py-20 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3"
                        >
                            <Activity className="w-3.5 h-3.5" />
                            <span>LIVE VERIFICATION FEED</span>
                        </motion.div>

                        <h2 className="text-3xl font-extrabold text-white tracking-tight">
                            Recent Verifications on <span className="text-gradient-cyan">OriginChain.</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE AUDIT STREAM ACTIVE</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RECENT_VERIFICATIONS.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>{item.status}</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-zinc-500">{item.time}</span>
                                </div>

                                <h3 className="text-sm font-bold text-white truncate mb-1">{item.title}</h3>
                                <span className="text-xs font-mono text-cyan-400 block mb-3">{item.proofId}</span>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                                <span>Creator: {item.creator}</span>
                                <span className="text-zinc-500">{item.block}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
