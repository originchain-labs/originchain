"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database,
    ShieldCheck,
    Lock,
    FileCode,
    Layers,
    UserCheck,
    KeyRound,
    Cpu,
    ArrowUpRight,
    Sparkles,
    type LucideIcon
} from "lucide-react";

type NodeConcept = {
    id: string;
    label: string;
    tagline: string;
    icon: LucideIcon;
    desc: string;
    connections: string[];
    details: string[];
    color: string;
    glow: string;
};

const CONCEPTS: NodeConcept[] = [
    {
        id: "ORIGIN",
        label: "ORIGIN",
        tagline: "Point of Creation",
        icon: Sparkles,
        desc: "The immutable moment a digital work is produced and timestamped locally before registry.",
        connections: ["ASSET", "IDENTITY", "PROOF"],
        details: ["Local browser SHA-256 computation", "EIP-712 cryptographic signature", "Zero-tamper origin stamp"],
        color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
        glow: "shadow-cyan-500/30",
    },
    {
        id: "ASSET",
        label: "ASSET",
        tagline: "Digital & Physical Work",
        icon: Layers,
        desc: "Any digital artwork, document, code, audio stem, or physical certificate mapped to a hash.",
        connections: ["ORIGIN", "PROOF", "CREATOR"],
        details: ["Raw binary hash fingerprint", "AI enriched metadata tags", "IPFS pinningCID"],
        color: "text-blue-400 border-blue-500/40 bg-blue-500/10",
        glow: "shadow-blue-500/30",
    },
    {
        id: "PROOF",
        label: "PROOF",
        tagline: "Cryptographic Certificate",
        icon: ShieldCheck,
        desc: "On-chain verifiable certificate encapsulating creator signature, block receipt, and hash.",
        connections: ["ORIGIN", "ASSET", "BLOCKCHAIN", "VERIFICATION"],
        details: ["Arbitrum Sepolia transaction receipt", "Non-repudiable proof ID", "Public zero-knowledge audit"],
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
        glow: "shadow-emerald-500/30",
    },
    {
        id: "BLOCKCHAIN",
        label: "BLOCKCHAIN",
        tagline: "Decentralized Ledger",
        icon: Database,
        desc: "Distributed consensus state preserving ownership records permanently across validation nodes.",
        connections: ["PROOF", "TRANSACTION", "VERIFICATION"],
        details: ["Smart contract execution", "Global state immutability", "Public block Explorer indexing"],
        color: "text-violet-400 border-violet-500/40 bg-violet-500/10",
        glow: "shadow-violet-500/30",
    },
    {
        id: "VERIFICATION",
        label: "VERIFICATION",
        tagline: "Public Zero-Auth Audit",
        icon: KeyRound,
        desc: "Instant public auditing tool allowing anyone to verify proof without connecting a wallet.",
        connections: ["PROOF", "BLOCKCHAIN", "IDENTITY"],
        details: ["No gas fees required", "100% transparent history", "Instant SHA-256 match check"],
        color: "text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-500/10",
        glow: "shadow-fuchsia-500/30",
    },
    {
        id: "IDENTITY",
        label: "IDENTITY",
        tagline: "Creator Signature",
        icon: UserCheck,
        desc: "Decentralized wallet identity binding creator handles and reputation metrics to registered works.",
        connections: ["ORIGIN", "CREATOR", "VERIFICATION"],
        details: ["SIWE wallet authentication", "On-chain reputation score", "Verified creator badge"],
        color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
        glow: "shadow-amber-500/30",
    },
    {
        id: "CREATOR",
        label: "CREATOR",
        tagline: "Author & Owner",
        icon: Cpu,
        desc: "The verified creator who initiates provenance and maintains permanent ownership credit.",
        connections: ["ASSET", "IDENTITY", "TRANSACTION"],
        details: ["Wallet signature authority", "Portfolio proof dashboard", "Peer audit review score"],
        color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
        glow: "shadow-teal-500/30",
    },
    {
        id: "TRANSACTION",
        label: "TRANSACTION",
        tagline: "On-Chain Registry Event",
        icon: FileCode,
        desc: "Atomic smart contract call recording asset hash and creator signature onto the ledger.",
        connections: ["BLOCKCHAIN", "CREATOR", "PROOF"],
        details: ["Gas optimized execution", "Smart contract event logs", "Arbitrum block confirmation"],
        color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
        glow: "shadow-indigo-500/30",
    },
];

export function EcosystemNodeGraph() {
    const [selectedId, setSelectedId] = useState<string>("ORIGIN");

    const selectedConcept = CONCEPTS.find((c) => c.id === selectedId) || CONCEPTS[0];

    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <span>INTERACTIVE NETWORK NODES</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Explore the <span className="text-gradient-cyan">Ecosystem Nodes.</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        Click or hover any node below to trace its cryptographic connections across the OriginChain network.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left 8 Interconnected Node Buttons */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                        {CONCEPTS.map((concept) => {
                            const Icon = concept.icon;
                            const isSelected = concept.id === selectedId;
                            const isConnected = selectedConcept.connections.includes(concept.id);

                            return (
                                <motion.button
                                    key={concept.id}
                                    onClick={() => setSelectedId(concept.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={`relative p-5 rounded-2xl border text-left transition-all backdrop-blur-md flex flex-col justify-between h-36 ${
                                        isSelected
                                            ? `${concept.color} shadow-2xl ${concept.glow} border-cyan-400 ring-2 ring-cyan-400/30 scale-105 z-20`
                                            : isConnected
                                            ? "border-cyan-500/40 bg-slate-900/80 text-white shadow-lg shadow-cyan-950/40 z-10"
                                            : "border-white/10 bg-slate-900/40 text-zinc-400 hover:border-white/20 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                                            isSelected ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300" : "bg-slate-800/60 border-white/5 text-zinc-400"
                                        }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        {isSelected && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block mb-1">
                                            NODE
                                        </span>
                                        <h3 className="text-sm font-bold font-mono tracking-wider text-white">
                                            {concept.label}
                                        </h3>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Right Detailed Node Card Inspector */}
                    <div className="lg:col-span-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedConcept.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl space-y-6 relative overflow-hidden"
                            >
                                {/* Ambient Background Glow inside Inspector */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner">
                                            <selectedConcept.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                                                ACTIVE PROTOCOL NODE
                                            </span>
                                            <h3 className="text-2xl font-extrabold text-white font-mono">
                                                {selectedConcept.label}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Tagline & Description */}
                                <div>
                                    <h4 className="text-sm font-bold text-cyan-300 font-mono mb-2">
                                        {selectedConcept.tagline}
                                    </h4>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        {selectedConcept.desc}
                                    </p>
                                </div>

                                {/* Core Mechanics Checklist */}
                                <div className="space-y-2 pt-2">
                                    <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block">
                                        PROTOCOL MECHANICS
                                    </span>
                                    <div className="space-y-2">
                                        {selectedConcept.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 border border-white/5 text-xs text-zinc-200 font-mono">
                                                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Connected Protocol Nodes */}
                                <div className="pt-4 border-t border-white/10">
                                    <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider block mb-3">
                                        ILLUMINATED CONNECTIONS
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedConcept.connections.map((connId) => (
                                            <button
                                                key={connId}
                                                onClick={() => setSelectedId(connId)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all"
                                            >
                                                → {connId}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
