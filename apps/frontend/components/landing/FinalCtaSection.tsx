"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export function FinalCtaSection() {
    return (
        <section className="relative min-h-screen py-28 flex flex-col justify-center overflow-hidden bg-transparent z-10 border-t border-white/5">


            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CLAIM YOUR PROOF OF ORIGIN</span>
                </motion.div>

                <div className="space-y-2">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
                    >
                        Start at the <span className="text-gradient-cyan">Origin.</span>
                    </motion.h2>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl font-extrabold text-cyan-300/90 font-mono"
                    >
                        Build the Proof.
                    </motion.h3>
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
                >
                    Turn your creative work into something that can be verified, trusted, and remembered.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link
                        href="/assets/upload"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                        <span>Register Your Asset</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                    </Link>

                    <Link
                        href="/verify"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-semibold text-sm border border-cyan-500/30 hover:border-cyan-400 backdrop-blur-md transition-all shadow-lg"
                    >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Verify an Asset</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
