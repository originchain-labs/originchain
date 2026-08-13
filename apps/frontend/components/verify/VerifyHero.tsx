"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";

export function VerifyHero() {
    return (
        <section className="relative pt-36 pb-16 overflow-hidden bg-transparent">
            {/* Background Ambient Radial Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-emerald-600/20 to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 backdrop-blur-md shadow-xl"
                >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold tracking-wider uppercase">PROOF VERIFICATION INFRASTRUCTURE</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto"
                >
                    Don't Just Trust It. <br className="hidden sm:inline" />
                    <span className="text-gradient-cyan">Verify the Origin.</span>
                </motion.h1>

                {/* Supporting Text */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
                >
                    Verify the authenticity, origin, and blockchain-backed cryptographic history of any digital asset without connecting a wallet.
                </motion.p>

                {/* Security Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-zinc-400 backdrop-blur-md"
                >
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Public Zero-Auth Audit: Never enter private keys or seed phrases.</span>
                </motion.div>
            </div>
        </section>
    );
}
