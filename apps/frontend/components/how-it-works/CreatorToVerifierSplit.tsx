"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck, Eye, ArrowRight } from "lucide-react";

export function CreatorToVerifierSplit() {
    return (
        <section className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        TWO SIDES OF THE CHAIN
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        From Creator to <span className="text-gradient-cyan">Verifier.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Creator Side */}
                    <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 text-center space-y-4 font-mono text-xs">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase">CREATOR SIDE</h3>
                        <p className="text-zinc-400">1. Produce Digital Work</p>
                        <p className="text-zinc-400">2. Register Asset & Hash</p>
                        <p className="text-zinc-400">3. Generate Proof Certificate</p>
                    </div>

                    {/* Middle Engine */}
                    <div className="p-8 rounded-3xl bg-cyan-500/10 border border-cyan-400/50 text-center space-y-4 font-mono text-xs">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 mx-auto flex items-center justify-center font-bold">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase">ORIGINCHAIN ENGINE</h3>
                        <p className="text-cyan-300 font-bold">Record Smart Contract</p>
                        <p className="text-cyan-300 font-bold">Connect Arbitrum Ledger</p>
                        <p className="text-cyan-300 font-bold">Consensus Validation</p>
                    </div>

                    {/* Verifier Side */}
                    <div className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 text-center space-y-4 font-mono text-xs">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase">VERIFIER SIDE</h3>
                        <p className="text-zinc-400">1. Search Asset or Hash</p>
                        <p className="text-zinc-400">2. Inspect On-Chain Block</p>
                        <p className="text-zinc-400">3. Confirm 100% Provenance</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
