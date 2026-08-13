"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Tag, User } from "lucide-react";
import { listAssets } from "@/lib/api-client";

type Asset = {
    id: string;
    title: string;
    description: string;
    ipfsCid: string;
    creator?: { walletAddress: string; handle?: string; displayName?: string };
    tags?: string[];
    createdAt?: string;
    reputationScore?: number;
};

export function ExploreAssetsSection() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchRealAssets() {
            try {
                const res = await listAssets({ page: 1 });
                if (isMounted && res && Array.isArray(res.results)) {
                    setAssets(res.results.slice(0, 3));
                }
            } catch {
                if (isMounted) setAssets([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchRealAssets();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">


            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6 relative z-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3"
                    >
                        <span>REGISTERED ASSET ECOSYSTEM</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Explore Verified <span className="text-gradient-cyan">Creativity.</span>
                    </motion.h2>
                </div>

                <Link
                    href="/assets"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-bold font-mono transition-all shadow-lg group"
                >
                    <span>EXPLORE ALL ASSETS</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Asset Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-80 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : assets.length === 0 ? (
                    <p className="text-sm text-zinc-400 font-mono">No assets registered yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {assets.map((asset, idx) => (
                            <motion.div
                                key={asset.id || idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                                className="group relative rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 p-6 flex flex-col justify-between backdrop-blur-md hover:-translate-y-1.5 transition-all shadow-xl"
                            >
                                <div>
                                    {/* Top Metadata */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>VERIFIED RECORD</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                                        {asset.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                        {asset.description}
                                    </p>

                                    {/* Tags */}
                                    {asset.tags && asset.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {asset.tags.map((t) => (
                                                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-zinc-400 text-[10px] font-mono">
                                                    <Tag className="w-2.5 h-2.5" />
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Creator Info & Action */}
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="truncate max-w-[120px]">
                                            {asset.creator?.handle || asset.creator?.walletAddress || "0x00...00"}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/assets/${asset.id}`}
                                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                    >
                                        <span>View</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
