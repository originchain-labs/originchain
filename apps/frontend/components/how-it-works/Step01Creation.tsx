"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, FileText, Palette, Award, Music, Box } from "lucide-react";

export function Step01Creation() {
    return (
        <section id="step-01" className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                            <span>STEP 01 — CREATION</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Every Proof Starts With an <span className="text-gradient-cyan">Origin.</span>
                        </h2>

                        <p className="text-base text-zinc-300 leading-relaxed">
                            An asset begins with its creator. Whether it is a digital canvas, software specification, audio stem, legal document, or physical luxury certificate, OriginChain computes a unique binary SHA-256 fingerprint client-side before transmission.
                        </p>

                        <div className="grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-cyan-400" />
                                <span>Digital Artwork</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                <span>Documents & IP</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                                <Music className="w-4 h-4 text-violet-400" />
                                <span>Audio Stems</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
                                <Box className="w-4 h-4 text-emerald-400" />
                                <span>Physical Assets</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Card */}
                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl w-full max-w-md space-y-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mx-auto">
                                <Upload className="w-8 h-8" />
                            </div>

                            <div>
                                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                                    CLIENT-SIDE SHA-256 HASHING
                                </span>
                                <h3 className="text-lg font-bold text-white">Binary Fingerprint Computed</h3>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-[11px] text-emerald-300 break-all">
                                0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                            </div>

                            <span className="text-xs text-zinc-400 font-mono block">
                                Raw content remains private on client device.
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
