"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";

type TimelineAsset = {
    id: string;
    title: string;
    registeredAt?: string | Date | null;
    proofId?: string | null;
};

type Props = {
    assets: TimelineAsset[];
};

const COLORS = [
    "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    "text-violet-400 border-violet-500/30 bg-violet-500/10",
    "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    "text-blue-400 border-blue-500/30 bg-blue-500/10",
];

export function CreatorTimeline({ assets }: Props) {
    if (assets.length === 0) return null;

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
                    {assets.slice(0, 4).map((asset, idx) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className={`p-6 rounded-2xl border ${COLORS[idx % COLORS.length]} backdrop-blur-md space-y-2`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-zinc-400">
                                    {asset.registeredAt ? new Date(asset.registeredAt).toISOString().slice(0, 10) : "—"}
                                </span>
                                <Upload className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-white font-mono">Asset Registered On-Chain</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed font-mono truncate">
                                {asset.title}{asset.proofId ? ` — ${asset.proofId}` : ""}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
