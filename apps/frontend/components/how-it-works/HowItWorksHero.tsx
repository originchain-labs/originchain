"use client";

import { motion } from "framer-motion";
import { Cpu, Sparkles, ArrowRight } from "lucide-react";

export function HowItWorksHero() {
    return (
        <section className="relative pt-36 pb-16 overflow-hidden bg-transparent">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-violet-600/20 to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Eyebrow Pill */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md shadow-xl"
                >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold tracking-wider uppercase">HOW ORIGINCHAIN WORKS</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto"
                >
                    From Origin to <span className="text-gradient-cyan">Verifiable Proof.</span>
                </motion.h1>

                {/* Supporting Text */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
                >
                    See how OriginChain transforms the origin of a digital asset into an immutable, tamper-resistant blockchain record.
                </motion.p>
            </div>
        </section>
    );
}
