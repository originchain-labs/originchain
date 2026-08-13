"use client";

import { motion } from "framer-motion";
import { Search, Database, ShieldCheck, CheckCircle2, Cpu, FileCode } from "lucide-react";

type Props = {
    currentStep: number;
};


const STEPS = [
    { label: "SEARCHING NETWORK", icon: Search },
    { label: "LOCATING PROOF", icon: Database },
    { label: "CHECKING RECORD", icon: FileCode },
    { label: "VALIDATING SIGNATURE", icon: Cpu },
    { label: "VERIFYING BLOCK", icon: ShieldCheck },
    { label: "ORIGIN CONFIRMED", icon: CheckCircle2 },
];

export function VerificationSequenceAnim({ currentStep }: Props) {
    return (
        <div className="p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>VERIFYING ON-CHAIN...</span>
            </div>

            {/* Stepper Progress Visual */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
                {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentStep;
                    const isDone = idx < currentStep;

                    return (
                        <div
                            key={step.label}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-2 font-mono text-[10px] ${
                                isActive
                                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20 scale-105"
                                    : isDone
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                    : "border-white/5 bg-slate-900/40 text-zinc-600"
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                isActive ? "bg-cyan-500/30 text-cyan-300 animate-bounce" : isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-zinc-600"
                            }`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold truncate w-full">{step.label}</span>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-zinc-400 font-mono pt-2">
                Querying Arbitrum Sepolia smart contracts & verifying SHA-256 hash payload...
            </p>
        </div>
    );
}
