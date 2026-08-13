"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database,
    Lock,
    Eye,
    ShieldCheck,
    FileCode,
    Share2,
    UserCheck,
    CheckCircle2,
    ChevronDown
} from "lucide-react";

const CONCEPTS = [
    {
        title: "Distributed Ledger",
        icon: Database,
        summary: "Global state sync across thousands of independent validation nodes.",
        details: "No single server holds authority. Transactions are broadcast globally across peer-to-peer nodes, preventing single points of failure.",
    },
    {
        title: "Immutability",
        icon: Lock,
        summary: "Tamper-proof storage guarantees records cannot be altered or retroactively erased.",
        details: "Once written to Arbitrum smart contracts, cryptographic block hashes prevent any backdating, editing, or silent data manipulation.",
    },
    {
        title: "Transparency",
        icon: Eye,
        summary: "Public block explorer access allows anyone to audit provenance history.",
        details: "Every registration transaction, IPFS CID pointer, and creator wallet signature is publicly readable on-chain 24/7.",
    },
    {
        title: "Cryptographic Proof",
        icon: ShieldCheck,
        summary: "SHA-256 binary hash fingerprinting seals content identity.",
        details: "A 64-character hexadecimal digest is computed client-side. Even a single bit change in the original file generates a completely different hash.",
    },
    {
        title: "Smart Contracts",
        icon: FileCode,
        summary: "Autonomous code enforcing rules without human intermediaries.",
        details: "Pre-compiled Solidity smart contracts execute ownership verification, reputation scoring, and event logging deterministically.",
    },
    {
        title: "Decentralization",
        icon: Share2,
        summary: "Content pinned to IPFS prevents centralized server removal.",
        details: "InterPlanetary File System (IPFS) content addressing ensures asset metadata remains available as long as any node pins it.",
    },
    {
        title: "Digital Identity",
        icon: UserCheck,
        summary: "Cryptographic wallet signatures verify creator authorship.",
        details: "Sign-In With Ethereum (SIWE) and EIP-712 structured domain signatures bind creator wallets directly to asset origin certificates.",
    },
    {
        title: "Public Auditability",
        icon: CheckCircle2,
        summary: "Zero-fee verification accessible to any web user without wallet sign-in.",
        details: "Verify proof IDs or SHA-256 hashes instantly through our zero-authentication public verification portal.",
    },
];

export function BlockchainConceptsGrid() {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const toggleExpand = (idx: number) => {
        setExpandedIdx(expandedIdx === idx ? null : idx);
    };

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
                        <span>PROTOCOL ARCHITECTURE</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Inside the <span className="text-gradient-cyan">Chain.</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        Understand the core Web3 building blocks powering OriginChain proof infrastructure.
                    </p>
                </div>

                {/* 8 Expandable Concept Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CONCEPTS.map((concept, idx) => {
                        const Icon = concept.icon;
                        const isExpanded = expandedIdx === idx;

                        return (
                            <motion.div
                                key={concept.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                onClick={() => toggleExpand(idx)}
                                className={`cursor-pointer rounded-2xl border p-6 backdrop-blur-md transition-all flex flex-col justify-between ${
                                    isExpanded
                                        ? "border-cyan-400 bg-slate-900/90 shadow-2xl shadow-cyan-950/60 scale-[1.02]"
                                        : "border-white/10 bg-slate-900/50 hover:border-cyan-500/40 hover:bg-slate-900/80"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className={`p-1 rounded-lg text-zinc-400 transition-transform ${isExpanded ? "rotate-180 text-cyan-400" : ""}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-white mb-2 font-mono">
                                        {concept.title}
                                    </h3>
                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        {concept.summary}
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="pt-4 mt-4 border-t border-white/10 text-xs text-cyan-200/90 font-mono leading-relaxed"
                                        >
                                            {concept.details}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
