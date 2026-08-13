"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Layers, Sparkles, ShieldCheck, FileCode, Database, Link2, KeyRound, Award } from "lucide-react";

const STAGES = [
    { id: "creator", name: "CREATOR", icon: User, desc: "Author signs payload with Web3 wallet identity." },
    { id: "asset", name: "ASSET", icon: Layers, desc: "Digital creation computes client-side SHA-256 fingerprint." },
    { id: "origin", name: "ORIGIN", icon: Sparkles, desc: "Timestamp & creator metadata payload packaged." },
    { id: "proof", name: "PROOF", icon: ShieldCheck, desc: "EIP-712 structured domain signature generated." },
    { id: "tx", name: "TRANSACTION", icon: FileCode, desc: "Smart contract call broadcast to Arbitrum network." },
    { id: "block", name: "BLOCK", icon: Database, desc: "Block mined embedding proof into immutable state." },
    { id: "chain", name: "CHAIN", icon: Link2, desc: "Cryptographically linked to previous block parent hash." },
    { id: "verify", name: "VERIFICATION", icon: KeyRound, desc: "Zero-auth public engine audits proof integrity." },
    { id: "trust", name: "TRUST", icon: Award, desc: "Verifiable origin built without central authority." },
];

export function EndToEndInteractiveCenterpiece() {
    const [selectedIdx, setSelectedIdx] = useState(0);

    const activeStage = STAGES[selectedIdx];

    return (
        <section className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        INTERACTIVE END-TO-END CENTERPIECE
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                        The Full <span className="text-gradient-cyan">OriginChain Pipeline.</span>
                    </h2>
                    <p className="text-base text-zinc-300">
                        Click any node below to trace data movement across the 9 core architecture stages.
                    </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mb-8">
                    {STAGES.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isSelected = selectedIdx === idx;
                        return (
                            <button
                                key={stage.id}
                                onClick={() => setSelectedIdx(idx)}
                                className={`p-3 rounded-2xl border text-center font-mono text-[10px] transition-all flex flex-col items-center space-y-2 ${
                                    isSelected
                                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg scale-105"
                                        : "border-white/5 bg-slate-900/40 text-zinc-400 hover:text-white"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-bold truncate w-full">{stage.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Active Stage Detail Banner */}
                <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        STAGE 0{selectedIdx + 1} — {activeStage.name}
                    </span>
                    <h3 className="text-xl font-bold text-white">{activeStage.desc}</h3>
                </div>
            </div>
        </section>
    );
}
