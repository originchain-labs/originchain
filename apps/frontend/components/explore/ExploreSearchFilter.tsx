"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Hash, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const QUICK_FILTERS = ["All", "Assets", "Creators", "Verified", "Recent"];

const DEMO_SEARCH_RESULTS = [
    { type: "Asset", title: "Quantum Genesis Canvas #04", ref: "0xe3b0...b855", status: "VERIFIED", path: "/assets/asset-101" },
    { type: "Creator", title: "Elena Vance (@cyber_artisan)", ref: "0x71C7...89A2", status: "VERIFIED CREATOR", path: "/creators/creator-1" },
    { type: "Proof", title: "Proof Record #OC-891042", ref: "Arbitrum Sepolia Block #948102", status: "IMMUTABLE", path: "/verify" },
];

export function ExploreSearchFilter() {
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredResults = DEMO_SEARCH_RESULTS.filter((item) => {
        const matchesQuery = query === "" || item.title.toLowerCase().includes(query.toLowerCase()) || item.ref.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = activeFilter === "All" || item.type.toLowerCase() === activeFilter.toLowerCase() || (activeFilter === "Verified" && item.status.includes("VERIFIED"));
        return matchesQuery && matchesFilter;
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
                            placeholder="Search assets, creator handles, wallet addresses, or SHA-256 hashes..."
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
                    {query.trim().length > 0 && (
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
