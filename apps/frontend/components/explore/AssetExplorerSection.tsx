"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, User, ExternalLink, Filter, Sparkles } from "lucide-react";
import { listAssets } from "@/lib/api-client";

type Asset = {
    id: string;
    title: string;
    description: string;
    ipfsCid: string;
    creator?: { walletAddress: string; handle?: string; displayName?: string };
    tags?: string[];
    category?: string;
    createdAt?: string;
    reputationScore?: number;
};

const CATEGORIES = [
    "All",
    "Digital Artwork",
    "Product Specification",
    "Document & IP",
    "Certificate",
    "Creative Audio",
    "Physical Provenance",
];

export function AssetExplorerSection() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchAssets() {
            try {
                const res = await listAssets({ page: 1 });
                if (isMounted && res && Array.isArray(res.results)) {
                    setAssets(res.results);
                }
            } catch {
                if (isMounted) setAssets([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchAssets();
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredAssets = selectedCategory === "All"
        ? assets
        : assets.filter((a) => a.category === selectedCategory || a.tags?.includes(selectedCategory));

    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>VERIFIED ASSET REPOSITORY</span>
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Explore <span className="text-gradient-cyan">Digital Assets.</span>
                        </h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                                    selectedCategory === cat
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Asset Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-80 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <p className="text-sm text-zinc-400 font-mono">No assets registered yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredAssets.map((asset, idx) => (
                            <motion.div
                                key={asset.id || idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 p-6 flex flex-col justify-between backdrop-blur-md hover:-translate-y-1.5 transition-all shadow-xl"
                            >
                                <div>
                                    {/* Top Status */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>✓ VERIFIED ORIGIN</span>
                                        </div>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                                        {asset.title}
                                    </h3>
                                    <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                        {asset.description}
                                    </p>

                                    {/* IPFS CID Pointer */}
                                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] font-mono text-zinc-400 mb-4 flex items-center justify-between">
                                        <span className="text-zinc-500">IPFS:</span>
                                        <span className="text-cyan-400 truncate max-w-[200px]">
                                            {asset.ipfsCid}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    {asset.tags && asset.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {asset.tags.map((t) => (
                                                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-zinc-400 text-[10px] font-mono">
                                                    <Tag className="w-2.5 h-2.5" />
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Action */}
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
                                        <span>Inspect Proof</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
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
