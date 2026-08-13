"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";
import { search } from "@/lib/api-client";

const QUICK_FILTERS = ["All", "Assets", "Creators", "Verified"];

type Result = { type: "Asset" | "Creator"; title: string; ref: string; status: string; path: string };

export function ExploreSearchFilter() {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [results, setResults] = useState<Result[]>([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const q = query.trim();
        if (q.length < 2) {
            queueMicrotask(() => setSearched(false));
            return;
        }
        let isCurrent = true;
        const timer = setTimeout(() => {
            search(q)
                .then((data) => {
                    if (!isCurrent) return;
                    const assetResults: Result[] = data.assets.map((a) => ({
                        type: "Asset",
                        title: a.title,
                        ref: `by ${a.creator.displayName}`,
                        status: "VERIFIED",
                        path: `/assets/${a.id}`,
                    }));
                    const creatorResults: Result[] = data.creators.map((c) => ({
                        type: "Creator",
                        title: c.displayName,
                        ref: c.walletAddress,
                        status: "CREATOR",
                        path: `/creators/${c.id}`,
                    }));
                    setResults([...assetResults, ...creatorResults]);
                    setSearched(true);
                })
                .catch(() => {
                    if (isCurrent) {
                        setResults([]);
                        setSearched(true);
                    }
                });
        }, 300);
        return () => {
            isCurrent = false;
            clearTimeout(timer);
        };
    }, [query]);

    const filteredResults = results.filter((item) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Assets") return item.type === "Asset";
        if (activeFilter === "Creators") return item.type === "Creator";
        if (activeFilter === "Verified") return item.type === "Asset";
        return true;
    });

    return (
        <section className="py-20 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Search Bar Container */}
                <div className="space-y-6">
                    <div className="text-center space-y-2 mb-8">
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                            ECOSYSTEM DISCOVERY & INDEXER
                        </span>
                        <h2 className="text-3xl font-extrabold text-white">
                            Search Assets, Creators & Proof IDs
                        </h2>
                    </div>

                    <div className="relative flex items-center p-2 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl group focus-within:border-cyan-400 transition-all">
                        <Search className="w-5 h-5 text-cyan-400 ml-4 mr-2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search assets or creator names (2+ characters)..."
                            className="flex-1 bg-transparent py-3.5 px-2 text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                        />

                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="px-3 text-xs font-mono text-zinc-400 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Filter className="w-4 h-4 text-zinc-500 mr-2" />
                        {QUICK_FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                                    activeFilter === f
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                                        : "bg-slate-900/60 text-zinc-400 hover:text-white hover:bg-slate-800 border border-white/5"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Live Results Drawer */}
                    {searched && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2 shadow-2xl"
                        >
                            <span className="text-[10px] font-mono text-zinc-500 uppercase px-2">
                                MATCHED RECORDS ({filteredResults.length})
                            </span>

                            {filteredResults.map((res, i) => (
                                <Link
                                    key={i}
                                    href={res.path}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-cyan-500/30 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold">
                                            {res.type[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono">
                                                {res.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-zinc-400">
                                                {res.ref}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                                            {res.status}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}

                            {filteredResults.length === 0 && (
                                <div className="p-4 text-center text-xs text-zinc-500 font-mono">
                                    No records matching &quot;{query}&quot;. Try a different SHA-256 hash or creator handle.
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
