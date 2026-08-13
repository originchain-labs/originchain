"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, Star, Layers, ArrowRight, CheckCircle2 } from "lucide-react";

type CreatorCard = {
    id: string;
    handle: string;
    displayName: string;
    walletAddress: string;
    registeredAssetsCount: number;
    reputationScore: number;
    badge: string;
    specialty: string;
};

const CREATORS: CreatorCard[] = [
    {
        id: "creator-1",
        handle: "@cyber_artisan",
        displayName: "Elena Vance",
        walletAddress: "0x71C7...89A2",
        registeredAssetsCount: 42,
        reputationScore: 99,
        badge: "TIER 1 — TOP CREATOR",
        specialty: "Generative AI & Digital Canvas",
    },
    {
        id: "creator-2",
        handle: "@solidity_master",
        displayName: "Marcus Thorne",
        walletAddress: "0x89C4...44D1",
        registeredAssetsCount: 28,
        reputationScore: 96,
        badge: "VERIFIED ARCHITECT",
        specialty: "Smart Contract Specs & IP",
    },
    {
        id: "creator-3",
        handle: "@synth_wave",
        displayName: "Aria Sterling",
        walletAddress: "0x3A91...1F82",
        registeredAssetsCount: 35,
        reputationScore: 100,
        badge: "AUDIO PROVENANCE MASTER",
        specialty: "Audio Synthesis & Stems",
    },
    {
        id: "creator-4",
        handle: "@horology_vault",
        displayName: "Vance Atelier",
        walletAddress: "0x4F12...99B0",
        registeredAssetsCount: 19,
        reputationScore: 98,
        badge: "PHYSICAL VAULT VERIFIED",
        specialty: "Luxury Physical Passports",
    },
];

export function CreatorEcosystemGrid() {
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
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono mb-3"
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>CREATOR COMMUNITY</span>
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                            Creators on <span className="text-gradient-violet">OriginChain.</span>
                        </h2>
                    </div>

                    <Link
                        href="/creators"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-violet-500/30 text-violet-300 hover:text-white hover:border-violet-400 text-xs font-bold font-mono transition-all shadow-lg group"
                    >
                        <span>VIEW ALL CREATORS</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* 4 Creator Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CREATORS.map((creator, idx) => (
                        <motion.div
                            key={creator.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-violet-500/40 backdrop-blur-md flex flex-col justify-between hover:-translate-y-1.5 transition-all shadow-xl"
                        >
                            <div>
                                {/* Header Avatar & Score */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center text-white font-bold font-mono text-lg shadow-inner">
                                        {creator.displayName[0]}
                                    </div>

                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span>{creator.reputationScore}</span>
                                    </div>
                                </div>

                                {/* Creator Info */}
                                <div className="space-y-1 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                                            {creator.displayName}
                                        </h3>
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                                    </div>
                                    <span className="text-xs font-mono text-zinc-400 block">
                                        {creator.handle}
                                    </span>
                                </div>

                                {/* Badge & Specialty */}
                                <div className="space-y-2 mb-6">
                                    <span className="inline-block px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                                        {creator.badge}
                                    </span>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        {creator.specialty}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Stats & Profile Link */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>{creator.registeredAssetsCount} Assets</span>
                                </div>

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
