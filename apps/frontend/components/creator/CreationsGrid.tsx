"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, ExternalLink, Filter } from "lucide-react";

type Asset = {
    id: string;
    title: string;
    description?: string;
    registeredAt?: string;
    category?: string;
    ipfsCid?: string;
};

type Props = {
    assets: Asset[];
};

const MOCK_CREATOR_ASSETS: Asset[] = [
    { id: "asset-1", title: "Quantum Genesis Canvas #04", description: "Generative matrix sealed with SHA-256 origin proof.", registeredAt: "2026-08-12", category: "Digital Artwork", ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
    { id: "asset-2", title: "Arbitrum Swarm Smart Contract Spec", description: "Formal spec for multi-agent contract execution.", registeredAt: "2026-08-10", category: "Document & IP", ipfsCid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG" },
    { id: "asset-3", title: "Sub-Zero Synthesizer Audio Stem", description: "Original uncompressed audio stem registered on IPFS.", registeredAt: "2026-08-08", category: "Creative Audio", ipfsCid: "QmZTR5bcpQDogVKTBABzM43WgP4gBum731nsktzn3s6hXY" },
    { id: "asset-4", title: "Luxury Watch Chronograph Passport", description: "Physical watch origin certificate backed by NFC chip.", registeredAt: "2026-08-05", category: "Physical Provenance", ipfsCid: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZvG7uKm" },
];

export function CreationsGrid({ assets = [] }: Props) {
    const displayAssets = assets.length > 0 ? assets : MOCK_CREATOR_ASSETS;
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const categories = ["ALL", "VERIFIED", "DIGITAL", "DOCUMENT", "CREATIVE"];

    return (
        <section className="py-12 relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            PORTFOLIO & PROOF REPOSITORY
                        </span>
                        <h2 className="text-2xl font-extrabold text-white">Registered Creations</h2>
                    </div>

                    <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md font-mono text-xs">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                                    selectedCategory === cat
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayAssets.map((asset, idx) => (
                        <motion.div
                            key={asset.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>✓ VERIFIED</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-zinc-500">{asset.registeredAt || "2026"}</span>
                                </div>

                                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                                    {asset.title}
                                </h3>

                                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-mono">
                                    {asset.description || "Verifiable origin asset registered on Arbitrum."}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                                <span className="text-zinc-500 text-[10px]">#OC-PROOF</span>
                                <Link
                                    href={`/assets/${asset.id}`}
                                    className="flex items-center gap-1 hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                                >
                                    <span>Inspect</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
