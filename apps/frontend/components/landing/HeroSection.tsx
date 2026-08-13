"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Lock, Cpu } from "lucide-react";

export function HeroSection() {
    const [videoError, setVideoError] = useState(false);

    return (
        <section className="relative min-h-screen py-24 flex items-center justify-center overflow-hidden bg-transparent z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Hero Text & CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 flex flex-col items-start text-left space-y-6"
                    >
                        {/* Network Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg shadow-cyan-950/40">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-semibold text-[11px] tracking-wide uppercase">THE ORIGIN OF TRUST</span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-emerald-400 font-sans font-medium text-[11px]">● Blockchain Network Connected</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                                Every Creation Has an <span className="text-gradient-cyan">Origin.</span>
                            </h1>
                            <p className="text-xl sm:text-2xl font-bold tracking-tight text-cyan-300/90 font-mono">
                                Create. Prove. Verify.
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                            OriginChain transforms creative work into verifiable digital proof through blockchain technology. Establish immutable provenance, decentralized storage, and public verification for every asset.
                        </p>

                        {/* Dual CTAs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                            <Link
                                href="/assets/upload"
                                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 group-hover:rotate-12 transition-transform" />
                                <span>Register Your Asset</span>
                                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/verify"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-white font-semibold text-sm border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md transition-all shadow-lg"
                            >
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                <span>Verify an Asset</span>
                            </Link>
                        </div>

                        {/* Feature Badges */}
                        <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 w-full text-xs text-zinc-400 font-mono">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span>Zero Tampering</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Lock className="w-4 h-4 text-violet-400 shrink-0" />
                                <span>IPFS Storage</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>AI Metadata</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Integrated Ecosystem Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="lg:col-span-6 relative flex justify-center items-center"
                    >
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/30 via-violet-500/20 to-emerald-500/20 blur-3xl opacity-70 animate-pulse-slow pointer-events-none" />

                        {/* Container Card for Visual */}
                        <div className="relative w-full max-w-lg lg:max-w-none aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 shadow-2xl shadow-cyan-950/60 group">
                            {/* Blended Video / Image Media */}
                            {!videoError ? (
                                <video
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                    poster="/assets/origin-chain-blockchain.png"
                                    onError={() => setVideoError(true)}
                                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                >
                                    <source src="/assets/origin-chain-blockchain.mp4" type="video/mp4" />
                                </video>
                            ) : (
                                <Image
                                    src="/assets/origin-chain-blockchain.png"
                                    alt="OriginChain Blockchain Ecosystem Visual"
                                    fill
                                    priority
                                    className="object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                            )}

                            {/* Gradient Blending Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/30 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/40 via-transparent to-[#030712]/40 pointer-events-none" />

                            {/* Floating Node Badges */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-6 left-6 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md flex items-center gap-2.5 text-xs text-cyan-300 font-mono shadow-xl"
                            >
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                <span>SMART CONTRACT VERIFIED</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-6 right-6 px-3.5 py-2 rounded-xl bg-slate-950/85 border border-violet-500/40 backdrop-blur-md flex items-center gap-2.5 text-xs text-violet-300 font-mono shadow-xl"
                            >
                                <span className="w-2 h-2 rounded-full bg-violet-400" />
                                <span>IMMUTABLE PROOF OF ORIGIN</span>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
