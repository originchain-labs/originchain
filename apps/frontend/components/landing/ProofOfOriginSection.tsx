"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, QrCode, ExternalLink, Hexagon, FileText, User, Hash, Clock } from "lucide-react";

export function ProofOfOriginSection() {
    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Text & CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>ON-CHAIN CERTIFICATE</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                            Your Work. <br />
                            Your Origin. <br />
                            <span className="text-gradient-cyan">Your Proof.</span>
                        </h2>

                        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                            OriginChain automatically generates cryptographic Proof of Origin certificates for every registered asset. Instantly audit creator signatures, SHA-256 hashes, IPFS pointers, and Arbitrum block receipts.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/verify"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                            >
                                <CheckCircle2 className="w-4 h-4 text-slate-950 fill-slate-950" />
                                <span>Verify an Asset</span>
                                <ExternalLink className="w-4 h-4 text-slate-950" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Premium Certificate Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-7 flex justify-center"
                    >
                        <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl group overflow-hidden">
                            {/* Certificate Background Holographic Mesh */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
                            
                            {/* Watermark Logo */}
                            <Hexagon className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-500/5 pointer-events-none" />

                            {/* Certificate Header */}
                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                                            ORIGINCHAIN PROOF CERTIFICATE
                                        </span>
                                        <h3 className="text-lg font-bold text-white">PROOF OF ORIGIN</h3>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold shadow-sm shadow-emerald-500/30">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                    <span>✓ VERIFIED</span>
                                </div>
                            </div>

                            {/* Certificate Body Grid */}
                            <div className="py-6 space-y-4 font-mono text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                            <User className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>CREATOR</span>
                                        </div>
                                        <div className="text-white font-bold truncate">0x71C7...89A2 (Verified)</div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                            <FileText className="w-3.5 h-3.5 text-violet-400" />
                                            <span>ASSET</span>
                                        </div>
                                        <div className="text-white font-bold truncate">Origin Genesis Masterwork #01</div>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                        <Hash className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>CRYPTOGRAPHIC SHA-256 HASH</span>
                                    </div>
                                    <div className="text-emerald-300 font-mono text-[11px] break-all">
                                        0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>TIMESTAMP</span>
                                        </div>
                                        <div className="text-white font-bold">2026-08-12 22:25:00 UTC</div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                                            <Hexagon className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>BLOCKCHAIN</span>
                                        </div>
                                        <div className="text-emerald-400 font-bold">Arbitrum Sepolia</div>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Footer */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                                <span>RECORD ID: #OC-891042</span>
                                <div className="flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-emerald-400 opacity-80" />
                                    <span>ON-CHAIN AUDITABLE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
