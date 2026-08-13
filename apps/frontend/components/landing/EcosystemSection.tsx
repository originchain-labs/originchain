"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Database, ShieldCheck, Lock, FileCode, Layers, RefreshCw, Link2, KeyRound } from "lucide-react";

export function EcosystemSection() {
    const concepts = [
        { label: "Distributed Ledger", icon: Database, desc: "Global decentralized state sync" },
        { label: "Immutability", icon: Lock, desc: "Tamper-proof cryptographic hashes" },
        { label: "Security", icon: ShieldCheck, desc: "Elliptic curve cryptography" },
        { label: "Smart Contracts", icon: FileCode, desc: "Automated execution on Arbitrum" },
        { label: "DeFi Integration", icon: Layers, desc: "Composable proof metadata" },
        { label: "Consensus Engine", icon: RefreshCw, desc: "Distributed validation nodes" },
        { label: "Supply Chain", icon: Link2, desc: "End-to-end digital provenance" },
        { label: "Chain Link", icon: KeyRound, desc: "Interoperable proof standards" },
    ];

    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">


            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3"
                >
                    <span>DECENTRALIZED INFRASTRUCTURE</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                >
                    Inside the <span className="text-gradient-cyan">Chain.</span>
                </motion.h2>

                <p className="text-base text-zinc-400 max-w-xl mx-auto mt-3">
                    Explore the foundational Web3 protocols powering OriginChain proof architecture.
                </p>
            </div>

            {/* Main Visual Showcase Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-950/40 p-4 sm:p-8">
                    {/* Background Visual Layer with Alternate Pan/Zoom */}
                    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden">
                        <Image
                            src="/assets/origin-chain-blockchain.png"
                            alt="Inside the Chain Visual"
                            fill
                            className="object-cover object-center scale-110 brightness-75 hover:scale-105 transition-transform duration-1000 ease-out"
                        />

                        {/* Radial Edge Fading */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 pointer-events-none" />

                        {/* Interactive Node Hotspots Over Grid */}
                        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-8 items-center">

                            {concepts.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                                        className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md hover:border-cyan-400 hover:bg-slate-900/90 transition-all shadow-lg group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                                                    {item.label}
                                                </h4>
                                                <p className="text-[10px] text-zinc-400 hidden sm:block">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
