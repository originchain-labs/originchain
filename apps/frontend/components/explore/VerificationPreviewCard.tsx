"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, QrCode, ExternalLink, User, Hash, Clock, Hexagon } from "lucide-react";

export function VerificationPreviewCard() {
    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Text */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>ZERO-AUTH PROOF AUDITING</span>
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                            Verify Anything. <br />
                            <span className="text-gradient-cyan">Trust the Origin.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            Every proof certificate registered on OriginChain is open to public inspection. No gas fees, registration, or wallet connection required to audit asset authenticity.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/verify"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.02] transition-all"
                            >
                                <ShieldCheck className="w-4 h-4 text-slate-950" />
                                <span>Audit a Proof Certificate</span>
                                <ExternalLink className="w-4 h-4 text-slate-950" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Premium Certificate Mockup */}
                    <div className="lg:col-span-7 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl group overflow-hidden"
                        >
                            {/* Certificate Background Holographic Mesh */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
                            
                            {/* Watermark Logo */}
                            <Hexagon className="absolute -bottom-10 -right-10 w-64 h-64 text-cyan-500/5 pointer-events-none" />

                            {/* Certificate Header */}
                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                                            ORIGINCHAIN PROOF CERTIFICATE
                                        </span>
                                        <h3 className="text-lg font-bold text-white">PROVENANCE VERIFIED</h3>
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
                                            <Hexagon className="w-3.5 h-3.5 text-violet-400" />
                                            <span>BLOCKCHAIN</span>
                                        </div>
                                        <div className="text-white font-bold truncate">Arbitrum Sepolia Log</div>
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
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>AUDIT STATUS</span>
                                        </div>
                                        <div className="text-emerald-400 font-bold">100% Immutable</div>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Footer */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                                <span>PROOF ID: #OC-891042</span>
                                <div className="flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-cyan-400 opacity-80" />
                                    <span>PUBLICLY AUDITABLE</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
