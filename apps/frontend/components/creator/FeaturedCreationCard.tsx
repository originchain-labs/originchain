"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, ExternalLink } from "lucide-react";

type FeaturedAsset = {
    id: string;
    title: string;
    description?: string | null;
    ipfsCid: string;
    registeredAt?: string | Date | null;
    proofId?: string | null;
};

type Props = {
    asset: FeaturedAsset | null;
};

export function FeaturedCreationCard({ asset }: Props) {
    if (!asset) return null;

    const createdDate = asset.registeredAt ? new Date(asset.registeredAt).toISOString().slice(0, 10) : "—";

    return (
        <section className="py-12 relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="space-y-4 mb-6">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        SIGNATURE WORK
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">Featured Creation</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                    {/* Left Canvas Preview */}
                    <div className="lg:col-span-6 h-64 rounded-2xl bg-gradient-to-tr from-cyan-900/40 via-violet-900/40 to-slate-900 border border-cyan-500/30 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
                        <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
                        <span className="text-base font-bold text-white font-mono truncate max-w-full px-4">
                            {asset.title}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono truncate max-w-full px-4">
                            IPFS: {asset.ipfsCid}
                        </span>
                    </div>

                    {/* Right Metadata */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                ✓ ORIGIN VERIFIED
                            </span>
                            {asset.proofId && (
                                <span className="text-xs font-mono text-cyan-400">{asset.proofId}</span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-2xl font-extrabold text-white">
                                {asset.title}
                            </h3>
                            <p className="text-xs text-zinc-300 font-mono mt-2 leading-relaxed">
                                {asset.description || "Verifiable origin asset registered on Arbitrum."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                <span className="text-zinc-500 text-[10px]">REGISTERED DATE</span>
                                <div className="text-white font-bold">{createdDate}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                <span className="text-zinc-500 text-[10px]">PROOF ID</span>
                                <div className="text-emerald-300 font-bold truncate">{asset.proofId || "—"}</div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href={`/assets/${asset.id}`}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                            >
                                <span>Inspect Proof</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
