"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Search, ArrowRight, Upload, Hash, CheckCircle2, FileSearch } from "lucide-react";

export function VerificationSection() {
    const [hashInput, setHashInput] = useState("");
    const router = useRouter();

    const handleQuickVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (hashInput.trim()) {
            router.push(`/verify?hash=${encodeURIComponent(hashInput.trim())}`);
        } else {
            router.push("/verify");
        }
    };

    return (
        <section className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ZERO-AUTHENTICATION AUDITING</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Don&apos;t Just Trust It. <span className="text-gradient-cyan">Verify It.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                    >
                        Anyone can verify the origin of a registered asset without connecting a wallet.
                    </motion.p>
                </div>

                {/* Visual Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 text-center space-y-3 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
                            STEP 01
                        </span>
                        <h3 className="text-base font-bold text-white">Upload File or Hash</h3>
                        <p className="text-xs text-zinc-400">Drag and drop file or paste SHA-256 fingerprint</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 text-center space-y-3 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 mx-auto flex items-center justify-center">
                            <FileSearch className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-violet-400 font-bold tracking-wider uppercase">
                            STEP 02
                        </span>
                        <h3 className="text-base font-bold text-white">Check Blockchain</h3>
                        <p className="text-xs text-zinc-400">Instant lookup on Arbitrum smart contract registry</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 text-center space-y-3 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
                            STEP 03
                        </span>
                        <h3 className="text-base font-bold text-white">✓ VERIFIED RECORD</h3>
                        <p className="text-xs text-zinc-400">View timestamp, creator address, & IPFS certificate</p>
                    </div>
                </div>

                {/* Quick Hash Verification Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <form
                        onSubmit={handleQuickVerify}
                        className="relative flex items-center p-2 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl group focus-within:border-cyan-400 transition-all"
                    >
                        <div className="pl-4 pr-2 text-zinc-500 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-cyan-400" />
                        </div>

                        <input
                            type="text"
                            value={hashInput}
                            onChange={(e) => setHashInput(e.target.value)}
                            placeholder="Enter SHA-256 hash or Proof ID to audit..."
                            className="flex-1 bg-transparent py-3 px-2 text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                        />

                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Search className="w-4 h-4 text-slate-950" />
                            <span>Verify Asset</span>
                            <ArrowRight className="w-4 h-4 text-slate-950" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-zinc-500 mt-3 font-mono">
                        No wallet registration or gas fees required for verification.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
