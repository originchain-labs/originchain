"use client";

import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, CheckCircle2, Copy, Check, Hexagon } from "lucide-react";
import { useState } from "react";

type Props = {
    displayName: string;
    handle: string;
    walletAddress: string;
    bio?: string;
    avatarCid?: string;
};

export function CreatorHero({ displayName, handle, walletAddress, bio }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shortAddr = walletAddress
        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
        : "0x71C7...89A2";

    return (
        <section className="relative pt-36 pb-12 overflow-hidden bg-transparent">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/20 via-cyan-600/20 to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/90 border border-violet-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                    {/* Left Avatar & Identity Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        {/* Avatar Frame */}
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-violet-600 via-cyan-500 to-blue-600 p-1 shadow-2xl shadow-cyan-500/20">
                                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-white font-extrabold text-3xl font-mono">
                                    {displayName ? displayName[0].toUpperCase() : "C"}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
                                <ShieldCheck className="w-4 h-4 fill-slate-950" />
                            </div>
                        </div>

                        {/* Title & Handles */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    {displayName}
                                </h1>
                                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>✓ VERIFIED CREATOR</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-3 font-mono text-xs text-zinc-400">
                                <span className="text-cyan-400 font-bold">{handle}</span>
                                <span>•</span>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors bg-slate-900 px-2.5 py-1 rounded-lg border border-white/5"
                                >
                                    <span>{shortAddr}</span>
                                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                                </button>
                            </div>

                            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed pt-1">
                                {bio || "Digital creator building verifiable provenance work and cryptographic origin records on OriginChain."}
                            </p>
                        </div>
                    </div>

                    {/* Right Web3 Identity Badge */}
                    <div className="flex flex-col items-center md:items-end gap-3 text-xs font-mono">
                        <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 text-zinc-300 flex items-center gap-2 backdrop-blur-md">
                            <Hexagon className="w-4 h-4 text-violet-400" />
                            <span>Arbitrum Sepolia Identity</span>
                        </div>
                        <span className="text-zinc-500 text-[11px]">Member since 2026</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
