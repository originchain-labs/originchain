"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { search } from "@/lib/api-client";

type CreatorResult = { id: string; displayName: string; walletAddress: string };

export function DiscoverCreatorsGrid() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<CreatorResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const q = searchQuery.trim();
        if (q.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }
        let isCurrent = true;
        setLoading(true);
        const timer = setTimeout(() => {
            search(q)
                .then((data) => {
                    if (isCurrent) {
                        setResults(data.creators);
                        setSearched(true);
                    }
                })
                .catch(() => {
                    if (isCurrent) {
                        setResults([]);
                        setSearched(true);
                    }
                })
                .finally(() => {
                    if (isCurrent) setLoading(false);
                });
        }, 300);
        return () => {
            isCurrent = false;
            clearTimeout(timer);
        };
    }, [searchQuery]);

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
                            placeholder="Search creators by name (2+ characters)..."
                            className="bg-transparent py-1.5 px-1 text-white placeholder-zinc-500 focus:outline-none w-full"
                        />
                    </div>
                </div>

                {searchQuery.trim().length < 2 ? (
                    <p className="text-sm text-zinc-500 font-mono">Search for a creator by name to discover their work.</p>
                ) : loading ? (
                    <p className="text-sm text-zinc-500 font-mono">Searching…</p>
                ) : searched && results.length === 0 ? (
                    <p className="text-sm text-zinc-500 font-mono">No creators found matching &quot;{searchQuery}&quot;.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((creator, idx) => (
                            <motion.div
                                key={creator.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1 transition-all shadow-xl group"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-white font-bold font-mono flex items-center justify-center mb-4">
                                        {creator.displayName ? creator.displayName[0].toUpperCase() : "C"}
                                    </div>

                                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                        {creator.displayName || "Unnamed Creator"}
                                    </h3>
                                    <span className="text-xs font-mono text-zinc-400 block mb-4 truncate">
                                        {creator.walletAddress}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-end text-xs font-mono">
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
                )}
            </div>
        </section>
    );
}
