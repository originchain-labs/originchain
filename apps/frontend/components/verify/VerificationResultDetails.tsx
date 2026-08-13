"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Copy,
    Check,
    ExternalLink,
    User,
    Hash,
    Clock,
    Database,
    FileText,
    Award,
    ChevronDown,
    Lock,
    Sparkles,
    Layers
} from "lucide-react";

type Props = {
    result: {
        verified: boolean;
        asset?: {
            id?: string;
            title?: string;
            contentHash?: string;
            registeredAt?: string;
            txHash?: string;
            proofId?: string;
            ipfsCid?: string;
        };
        creatorAddress?: string;
        creatorDisplayName?: string;
    } | null;
    queryStr: string;
    onReset: () => void;
};

export function VerificationResultDetails({ result, queryStr, onReset }: Props) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [proofExpanded, setProofExpanded] = useState(false);

    if (!result) return null;

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const isVerified = result.verified;
    const asset = result.asset || {};
    const title = asset.title || "Untitled Asset";
    const contentHash = asset.contentHash || "—";
    const registeredAt = asset.registeredAt ? new Date(asset.registeredAt).toUTCString() : "—";
    const txHash = asset.txHash || "—";
    const proofId = asset.proofId || "—";
    const ipfsCid = asset.ipfsCid || "—";
    const creator = result.creatorDisplayName || "Unknown creator";
    const creatorAddr = result.creatorAddress || "—";

    if (!isVerified) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-950/90 border border-rose-500/40 shadow-2xl shadow-rose-950/40 backdrop-blur-xl text-center space-y-6"
            >
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
                    <XCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <span className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
                        VERIFICATION FAILED
                    </span>
                    <h2 className="text-3xl font-extrabold text-white">No Matching Proof Record Found</h2>
                    <p className="text-sm text-zinc-400 max-w-lg mx-auto font-mono">
                        We couldn&apos;t locate an authentic on-chain proof matching query &quot;{queryStr}&quot;. The asset may not be registered yet.
                    </p>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={onReset}
                        className="px-6 py-3 rounded-xl bg-slate-900 border border-white/10 text-white hover:bg-slate-800 text-xs font-mono font-bold transition-all"
                    >
                        Try Another Search
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-16"
        >
            {/* 1. Verified Banner Status */}
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-inner">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold">
                                ✓ ORIGIN VERIFIED
                            </span>
                            <span className="text-xs font-mono text-zinc-400">100% IMMUTABLE PROOF</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
                        <p className="text-xs text-zinc-400 font-mono">Registered on Arbitrum Sepolia Smart Contract</p>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all"
                >
                    Audit Another Asset
                </button>
            </div>

            {/* 2. Asset Details Grid */}
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">ASSET DETAILS</h3>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">{proofId}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <span className="text-zinc-400 text-[11px]">ASSET TITLE</span>
                        <div className="text-white font-bold text-sm truncate">{title}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <span className="text-zinc-400 text-[11px]">CREATOR IDENTITY</span>
                        <div className="text-cyan-300 font-bold truncate">{creator}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <span className="text-zinc-400 text-[11px]">REGISTRATION TIMESTAMP</span>
                        <div className="text-white font-bold">{registeredAt}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                        <span className="text-zinc-400 text-[11px]">DECENTRALIZED STORAGE (IPFS)</span>
                        <div className="text-emerald-300 font-bold truncate">{ipfsCid}</div>
                    </div>
                </div>
            </div>

            {/* 3. Proof of Origin Node Pipeline */}
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">PROOF OF ORIGIN PIPELINE</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center font-mono text-xs">
                    {["CREATOR", "ASSET", "ORIGIN HASH", "PROOF PAYLOAD", "ARBITRUM LOG", "VERIFIED"].map((step, idx) => (
                        <div key={step} className="p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 flex flex-col items-center space-y-1">
                            <span className="text-[10px] text-zinc-400">STAGE 0{idx + 1}</span>
                            <span className="font-bold text-[11px]">{step}</span>
                            <span className="text-emerald-400 text-[10px]">✓ CONFIRMED</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. On-Chain Record Details */}
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">ON-CHAIN BLOCKCHAIN RECORD</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                        Arbitrum Sepolia
                    </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                    {/* Transaction Hash */}
                    <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center justify-between">
                        <div>
                            <span className="text-zinc-400 text-[11px] block">TRANSACTION HASH</span>
                            <span className="text-cyan-300 font-bold text-sm truncate">{txHash}</span>
                        </div>
                        <button
                            onClick={() => copyToClipboard(txHash, "txHash")}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-300 transition-colors"
                        >
                            {copiedField === "txHash" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {asset.txHash && (
                        <div className="pt-2">
                            <a
                                href={`https://sepolia.arbiscan.io/tx/${asset.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                <span>View on Arbitrum Block Explorer</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Cryptographic Proof Payload (Expandable) */}
            <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl space-y-4">
                <div
                    onClick={() => setProofExpanded(!proofExpanded)}
                    className="flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white">CRYPTOGRAPHIC PROOF PAYLOAD</h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${proofExpanded ? "rotate-180 text-cyan-400" : ""}`} />
                </div>

                <AnimatePresence>
                    {proofExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-4 border-t border-white/10 space-y-4 font-mono text-xs"
                        >
                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                                <span className="text-zinc-400 text-[11px]">SHA-256 BINARY CONTENT HASH</span>
                                <div className="text-emerald-300 font-mono text-xs break-all bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
                                    {contentHash}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                                <span className="text-zinc-400 text-[11px]">EIP-712 STRUCTURED DOMAIN PROOF PAYLOAD</span>
                                <div className="text-cyan-300 font-mono text-[11px] break-all bg-slate-950 p-3 rounded-xl border border-cyan-500/30">
                                    {JSON.stringify({
                                        domain: { name: "OriginChain", version: "1.0", chainId: 421614 },
                                        message: { contentHash, creator: creatorAddr, timestamp: registeredAt },
                                    }, null, 2)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
