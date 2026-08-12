"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCode2, ShieldCheck, HardDrive, CheckCircle2, Award, ArrowRight } from "lucide-react";

const STAGES = [
    {
        num: "01",
        name: "CREATE",
        title: "Asset Creation & Local Hash",
        desc: "Upload your digital creation. SHA-256 fingerprint is calculated locally in your browser before transmission.",
        icon: Upload,
        color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    },
    {
        num: "02",
        name: "REGISTER",
        title: "Wallet EIP-712 Signature",
        desc: "Authorize registration with your Web3 wallet signature, permanently binding your creator identity.",
        icon: FileCode2,
        color: "text-blue-400 border-blue-500/40 bg-blue-500/10",
    },
    {
        num: "03",
        name: "GENERATE PROOF",
        title: "Cryptographic Certificate",
        desc: "OriginChain generates an immutable Proof of Origin certificate containing creator, hash, and timestamp payload.",
        icon: ShieldCheck,
        color: "text-violet-400 border-violet-500/40 bg-violet-500/10",
    },
    {
        num: "04",
        name: "STORE ON CHAIN",
        title: "Arbitrum & IPFS Pinning",
        desc: "Metadata payload is pinned to IPFS and committed permanently into Arbitrum smart contract storage.",
        icon: HardDrive,
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    },
    {
        num: "05",
        name: "VERIFY",
        title: "Public Zero-Auth Audit",
        desc: "Anyone can query the SHA-256 hash or Proof ID to independently verify authenticity without wallet auth.",
        icon: CheckCircle2,
        color: "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10",
    },
    {
        num: "06",
        name: "TRUST",
        title: "Verifiable Origin Provenance",
        desc: "Build an audit-ready reputation score backed by immutable on-chain transactions and verifiable badges.",
        icon: Award,
        color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    },
];

export function InteractiveLifecycle() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono"
                    >
                        <span>END-TO-END PROVENANCE PIPELINE</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        How <span className="text-gradient-violet">OriginChain</span> Works.
                    </h2>

                    <p className="text-base text-zinc-300">
                        Follow the 6-stage cryptographic pipeline from creation to public verification trust.
                    </p>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    {STAGES.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isHovered = hoveredIdx === idx;

                        return (
                            <motion.div
                                key={stage.num}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className={`relative p-6 rounded-2xl border transition-all backdrop-blur-md flex flex-col justify-between h-80 ${
                                    isHovered
                                        ? `${stage.color} shadow-2xl scale-105 z-20 border-cyan-400`
                                        : "border-white/10 bg-slate-900/50 text-zinc-400 hover:border-white/20 hover:text-white z-10"
                                }`}
                            >
                                <div>
                                    {/* Top Number & Icon */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                            isHovered ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300" : "bg-slate-800/80 border-white/5 text-zinc-400"
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg font-bold font-mono text-zinc-600">
                                            {stage.num}
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                                        {stage.name}
                                    </span>
                                    <h3 className="text-sm font-bold text-white mb-2">
                                        {stage.title}
                                    </h3>
                                </div>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {stage.desc}
                                </p>

                                {/* Desktop Arrow Indicator */}
                                {idx < STAGES.length - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-30">
                                        <div className="w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
