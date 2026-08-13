"use client";

import { motion } from "framer-motion";
import { Database, HardDrive, ShieldCheck, FileCode } from "lucide-react";

export function WhatGetsRecordedSection() {
    return (
        <section className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        DATA ARCHITECTURE TRANSPARENCY
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        What Gets Recorded <span className="text-gradient-cyan">On-Chain?</span>
                    </h2>
                    <p className="text-base text-zinc-300">
                        OriginChain optimizes gas and privacy by separating cryptographic proof anchors from raw asset binaries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* On-Chain Records */}
                    <div className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 space-y-4 font-mono text-xs">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <Database className="w-6 h-6 text-emerald-400" />
                            <h3 className="text-lg font-bold text-white">STORED ON ARBITRUM SMART CONTRACTS</h3>
                        </div>

                        <ul className="space-y-2 text-zinc-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> 64-Character SHA-256 Content Fingerprint Hash
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Creator Wallet Address Signature (EIP-712)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Registration Timestamp & Block Receipt
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> IPFS Metadata Content ID (CID) Pointer
                            </li>
                        </ul>
                    </div>

                    {/* Decentralized & Local Storage */}
                    <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 space-y-4 font-mono text-xs">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <HardDrive className="w-6 h-6 text-cyan-400" />
                            <h3 className="text-lg font-bold text-white">STORED ON IPFS / CLIENT DEVICE</h3>
                        </div>

                        <ul className="space-y-2 text-zinc-300">
                            <li className="flex items-center gap-2">
                                <span className="text-cyan-400">✓</span> Decentralized Pinned Asset Metadata (JSON)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-cyan-400">✓</span> Raw Heavy Asset Files (PNG, CAD, PDF, Audio)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-cyan-400">✓</span> Private Creator Keys & Unhashed Draft Files
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-cyan-400">✓</span> Local High-Res Original Masters
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
