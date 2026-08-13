"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCheck, Search, ShieldCheck, ArrowRight, Star } from "lucide-react";

type CreatorItem = {
    id: string;
    displayName: string;
    handle: string;
    registeredAssetsCount: number;
    reputationScore: number;
    category: string;
};

const DEMO_CREATORS: CreatorItem[] = [
    { id: "creator-1", displayName: "Elena Vance", handle: "@cyber_artisan", registeredAssetsCount: 42, reputationScore: 99, category: "Generative AI" },
    { id: "creator-2", displayName: "Marcus Thorne", handle: "@solidity_master", registeredAssetsCount: 28, reputationScore: 96, category: "Smart Contracts" },
    { id: "creator-3", displayName: "Aria Sterling", handle: "@synth_wave", registeredAssetsCount: 35, reputationScore: 100, category: "Creative Audio" },
    { id: "creator-4", displayName: "Vance Atelier", handle: "@horology_vault", registeredAssetsCount: 19, reputationScore: 98, category: "Physical Passports" },
];

export function DiscoverCreatorsGrid() {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = DEMO_CREATORS.filter((c) =>
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || c.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="py-16 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            COMMUNITY DIRECTORY
                        </span>
                        <h2 className="text-2xl font-extrabold text-white">Discover Creators</h2>
                    </div>

                    <div className="relative flex items-center w-full md:w-80 p-1.5 rounded-xl bg-slate-950 border border-white/10 focus-within:border-cyan-400 transition-all font-mono text-xs">
                        <Search className="w-4 h-4 text-zinc-500 ml-2 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search creators by name or handle..."
                            className="bg-transparent py-1.5 px-1 text-white placeholder-zinc-500 focus:outline-none w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((creator, idx) => (
                        <motion.div
                            key={creator.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-white font-bold font-mono flex items-center justify-center">
                                        {creator.displayName[0]}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{creator.reputationScore}</span>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                    {creator.displayName}
                                </h3>
                                <span className="text-xs font-mono text-zinc-400 block mb-2">{creator.handle}</span>
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-zinc-300 text-[10px] font-mono mb-4">
                                    {creator.category}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                                <span className="text-zinc-400">{creator.registeredAssetsCount} Assets</span>
                                <Link
                                    href={`/creators/${creator.id}`}
                                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                >
                                    <span>Profile</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
