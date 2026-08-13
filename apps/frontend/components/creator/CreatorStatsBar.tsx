"use client";

import { motion } from "framer-motion";
import { Layers, ShieldCheck, Database, Calendar } from "lucide-react";

type Props = {
    registeredCount?: number;
    verifiedCount?: number;
    reputationScore?: number;
};

export function CreatorStatsBar({ registeredCount = 24, verifiedCount = 21, reputationScore = 98 }: Props) {
    const stats = [
        { label: "REGISTERED ASSETS", val: registeredCount, icon: Layers, color: "text-cyan-400" },
        { label: "VERIFIED PROOFS", val: verifiedCount, icon: ShieldCheck, color: "text-emerald-400" },
        { label: "ON-CHAIN RECORDS", val: registeredCount, icon: Database, color: "text-violet-400" },
        { label: "REPUTATION SCORE", val: `${reputationScore}/100`, icon: Calendar, color: "text-amber-400" },
    ];

    return (
        <section className="py-6 relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                                        {s.label}
                                    </span>
                                    <Icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                                    {s.val}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
