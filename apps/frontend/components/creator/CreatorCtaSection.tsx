"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function CreatorCtaSection() {
    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md shadow-lg"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>OWN YOUR CREATIVITY</span>
                </motion.div>

                <div className="space-y-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
                    >
                        Put Your Work on the <span className="text-gradient-cyan">Chain.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Register your creation, establish its origin, and make its proof verifiable across the global Web3 ecosystem.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center pt-4"
                >
                    <Link
                        href="/assets/upload"
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                        <span>Register an Asset Now</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
