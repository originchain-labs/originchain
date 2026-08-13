"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Upload, UserCheck, CheckCircle2, Clock } from "lucide-react";
import { listAssets } from "@/lib/api-client";

type EventItem = {
    type: string;
    title: string;
    actor: string;
    time: string;
    hash: string;
    icon: typeof Upload;
    color: string;
};

const DEFAULT_ACTIVITIES: EventItem[] = [
    {
        type: "ASSET REGISTERED",
        title: "Quantum Genesis Canvas #04",
        actor: "0x71C7...89A2",
        time: "2 mins ago",
        hash: "0xe3b0c442...b855",
        icon: Upload,
        color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
        type: "PROOF SEALED",
        title: "Proof Record #OC-891042",
        actor: "Arbitrum Smart Contract",
        time: "8 mins ago",
        hash: "Block #948102",
        icon: ShieldCheck,
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
        type: "ZERO-AUTH AUDIT",
        title: "Arbitrum Swarm Spec",
        actor: "Public Auditor (0x00...00)",
        time: "14 mins ago",
        hash: "✓ Verified 100%",
        icon: CheckCircle2,
        color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    },
    {
        type: "CREATOR SIGNED",
        title: "Aria Sterling (@synth_wave)",
        actor: "0x3A91...1F82",
        time: "25 mins ago",
        hash: "EIP-712 Verified",
        icon: UserCheck,
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
];

export function RecentActivityTimeline() {
    const [events, setEvents] = useState<EventItem[]>(DEFAULT_ACTIVITIES);

    useEffect(() => {
        listAssets({ page: 1 })
            .then((res) => {
                if (res?.assets && Array.isArray(res.assets) && res.assets.length > 0) {
                    const fetched: EventItem[] = res.assets.slice(0, 4).map((asset: { title: string; contentHash: string; creator?: { displayName?: string; walletAddress?: string }; registeredAt?: string }, idx: number) => ({
                        type: idx % 2 === 0 ? "ASSET REGISTERED" : "PROOF VERIFIED",
                        title: asset.title || "Untitled Creation",
                        actor: asset.creator?.displayName || (asset.creator?.walletAddress ? `${asset.creator.walletAddress.slice(0, 6)}...${asset.creator.walletAddress.slice(-4)}` : "Arbitrum Node"),
                        time: asset.registeredAt ? new Date(asset.registeredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
                        hash: asset.contentHash ? `${asset.contentHash.slice(0, 10)}...${asset.contentHash.slice(-6)}` : "0x...",
                        icon: idx % 2 === 0 ? Upload : ShieldCheck,
                        color: idx % 2 === 0 ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                    }));
                    setEvents(fetched);
                }
            })
            .catch(() => {
                // Keep default simulated events if offline
            });
    }, []);

    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3"
                        >
                            <Activity className="w-3.5 h-3.5 animate-pulse" />
                            <span>LIVE PROTOCOL EVENT FEED</span>
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Recent on <span className="text-gradient-cyan">OriginChain.</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>LIVE ON-CHAIN BLOCKCHAIN FEED</span>
                    </div>
                </div>

                {/* Timeline Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.map((act, idx) => {
                        const Icon = act.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1.5 transition-all shadow-xl group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${act.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                                            <Clock className="w-3 h-3" />
                                            <span>{act.time}</span>
                                        </div>
                                    </div>

                                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                                        {act.type}
                                    </span>
                                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                                        {act.title}
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-400 truncate mb-4">
                                        Actor: {act.actor}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-cyan-300 truncate">
                                    {act.hash}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
