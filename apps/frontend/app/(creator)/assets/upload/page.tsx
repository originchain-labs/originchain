"use client";

import { useState, useRef } from "react";
import { useAsset } from "@/hooks/useAsset";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck, Loader2, CheckCircle2, AlertTriangle, Sparkles, Hash, Tag, ArrowRight, RotateCcw, ShieldCheck, Zap } from "lucide-react";

const steps = [
    { label: "Upload", icon: Upload },
    { label: "Review", icon: FileCheck },
    { label: "Register", icon: ShieldCheck },
    { label: "Done", icon: CheckCircle2 },
];

function getStepIndex(step: string) {
    if (step === "idle") return 0;
    if (step === "hashing" || step === "preparing") return 0;
    if (step === "review") return 1;
    if (step === "signing" || step === "confirming") return 2;
    if (step === "done") return 3;
    if (step === "confirmFailed") return 2;
    return 0;
}

export default function UploadAssetPage() {
    const [file, setFile] = useState<File | null>(null);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [finalTitle, setFinalTitle] = useState("");
    const [finalDescription, setFinalDescription] = useState("");
    const [finalTags, setFinalTags] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [devMode, setDevMode] = useState(true); // Dev mode ON by default — no gas fees
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { step, error, preview, selectAndPrepare, confirmAndRegister, devConfirmAndRegister, retryConfirmation } = useAsset();
    const currentStep = getStepIndex(step);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) setFile(dropped);
    };

    const handleRegister = () => {
        if (!preview) return;
        const title = finalTitle || preview.title;
        const desc = finalDescription || preview.description;
        const tags = (finalTags || preview.tags.join(", ")).split(",").map((t) => t.trim()).filter(Boolean);

        if (devMode) {
            devConfirmAndRegister(title, desc, tags);
        } else {
            confirmAndRegister(title, desc, tags);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-2xl px-6 pb-20 pt-28">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        {devMode ? "DEV MODE — FREE REGISTRATION" : "ON-CHAIN REGISTRATION"}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Register Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Asset</span>
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Upload your creation, verify its hash, and establish proof of origin.
                    </p>
                </motion.div>

                {/* Dev Mode Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="flex items-center justify-center gap-3 mb-8"
                >
                    <button
                        onClick={() => setDevMode(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                            devMode
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                : "bg-slate-900/40 border border-white/10 text-zinc-500 hover:border-white/20"
                        }`}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Dev Mode (Free)
                    </button>
                    <button
                        onClick={() => setDevMode(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                            !devMode
                                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10"
                                : "bg-slate-900/40 border border-white/10 text-zinc-500 hover:border-white/20"
                        }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        On-Chain (Gas)
                    </button>
                </motion.div>

                {/* Step Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between mb-10 px-4"
                >
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i === currentStep;
                        const isComplete = i < currentStep;
                        return (
                            <div key={s.label} className="flex items-center gap-0 flex-1 last:flex-none">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                                        isComplete ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" :
                                        isActive ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/20" :
                                        "bg-slate-900/60 border-white/10 text-zinc-600"
                                    }`}>
                                        <Icon className="w-4.5 h-4.5" />
                                    </div>
                                    <span className={`text-[10px] font-mono tracking-wider ${
                                        isComplete || isActive ? "text-cyan-400" : "text-zinc-600"
                                    }`}>{s.label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-px mx-3 mb-5 transition-colors duration-500 ${
                                        i < currentStep ? "bg-cyan-500/40" : "bg-white/5"
                                    }`} />
                                )}
                            </div>
                        );
                    })}
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden"
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/10 via-transparent to-violet-500/10 pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    <div className="relative p-8">
                        <AnimatePresence mode="wait">
                            {/* STEP: IDLE — Upload Form */}
                            {step === "idle" && (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 mb-6 ${
                                            isDragging
                                                ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                                                : file
                                                    ? "border-cyan-500/30 bg-cyan-500/5"
                                                    : "border-white/15 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/5"
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                            className="hidden"
                                        />
                                        {file ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileCheck className="w-10 h-10 text-cyan-400" />
                                                <p className="text-sm font-medium text-white">{file.name}</p>
                                                <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center">
                                                    <Upload className="w-6 h-6 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-300">Drop your file here or click to browse</p>
                                                    <p className="text-xs text-zinc-500 mt-1">Images, documents, 3D models, music, code — any creation</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative mb-4">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <input
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/40 focus:bg-cyan-500/5 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                            placeholder="Asset title"
                                            value={draftTitle}
                                            onChange={(e) => setDraftTitle(e.target.value)}
                                        />
                                    </div>

                                    <textarea
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/40 focus:bg-cyan-500/5 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all min-h-[100px] resize-none mb-6"
                                        placeholder="Description (optional)"
                                        value={draftDescription}
                                        onChange={(e) => setDraftDescription(e.target.value)}
                                    />

                                    <button
                                        onClick={() => file && selectAndPrepare(file, draftTitle, draftDescription)}
                                        disabled={!file || !draftTitle}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Hash className="w-4 h-4" />
                                        Compute Hash & Prepare
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP: HASHING / PREPARING */}
                            {(step === "hashing" || step === "preparing") && (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                            <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
                                        </div>
                                        <div className="absolute -inset-2 rounded-2xl bg-cyan-500/10 blur-xl animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white">
                                            {step === "hashing" ? "Computing SHA-256 hash..." : "Uploading to IPFS & analyzing..."}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">Establishing cryptographic proof of your creation</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP: REVIEW */}
                            {step === "review" && preview && (
                                <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-4 mb-6 space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                                            <Hash className="w-3.5 h-3.5" />
                                            <span className="break-all">{preview.contentHash}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span className="break-all">IPFS: {preview.ipfsCid}</span>
                                        </div>
                                    </div>

                                    {/* Dev mode badge */}
                                    {devMode && (
                                        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-xs text-emerald-400 font-mono mb-4">
                                            <Zap className="w-3.5 h-3.5" />
                                            Dev Mode — No gas fees, instant registration
                                        </div>
                                    )}

                                    <div className="relative mb-4">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <input
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                            value={finalTitle || preview.title}
                                            onChange={(e) => setFinalTitle(e.target.value)}
                                        />
                                    </div>

                                    <textarea
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all min-h-[80px] resize-none mb-4"
                                        value={finalDescription || preview.description}
                                        onChange={(e) => setFinalDescription(e.target.value)}
                                    />

                                    <div className="relative mb-6">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <input
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                                            placeholder="Tags (comma separated)"
                                            value={finalTags || preview.tags.join(", ")}
                                            onChange={(e) => setFinalTags(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={handleRegister}
                                        className={`w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg hover:brightness-110 transition-all ${
                                            devMode
                                                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-500/25"
                                                : "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-violet-500/25"
                                        }`}
                                    >
                                        {devMode ? <Zap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                        {devMode ? "Register Instantly (Free)" : "Confirm & Register On-Chain"}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP: SIGNING / CONFIRMING */}
                            {(step === "signing" || step === "confirming") && (
                                <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                            <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
                                        </div>
                                        <div className="absolute -inset-2 rounded-2xl bg-violet-500/10 blur-xl animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white">
                                            {devMode ? "Registering asset..." : step === "signing" ? "Waiting for wallet signature..." : "Confirming on-chain..."}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {devMode ? "Saving to database — no gas fees" : "Please approve the transaction in your wallet"}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP: CONFIRM FAILED */}
                            {step === "confirmFailed" && (
                                <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8 gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div className="text-center max-w-sm">
                                        <p className="text-sm text-amber-300 mb-1">Registration partially succeeded</p>
                                        <p className="text-xs text-zinc-400">Safe to retry — this won&apos;t submit another transaction.</p>
                                    </div>
                                    <button
                                        onClick={() => retryConfirmation()}
                                        className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-5 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-all"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Retry Saving
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP: DONE */}
                            {step === "done" && (
                                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-12 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <div className="absolute -inset-3 rounded-2xl bg-emerald-500/10 blur-xl" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white mb-1">Asset Registered Successfully! 🎉</p>
                                        <p className="text-xs text-zinc-400">
                                            {devMode ? "Your creation is saved and visible on the platform" : "Your creation is permanently anchored on the blockchain"}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Display */}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400 font-mono break-all">
                                {error}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}