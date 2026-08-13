"use client";

import { motion } from "framer-motion";
import { Palette, CheckCircle2, ArrowRight } from "lucide-react";

const STORY_STEPS = [
    "1. Elena creates high-resolution digital artwork.",
    "2. She uploads it to OriginChain where SHA-256 hash is computed in browser.",
    "3. Elena signs registration with her Web3 wallet.",
    "4. OriginChain generates an immutable EIP-712 proof certificate.",
    "5. Metadata is pinned to IPFS and committed to Arbitrum smart contract.",
    "6. Arbitrum validator nodes confirm transaction in block #948102.",
    "7. A collector audits Elena's artwork on the public Verify page.",
    "8. OriginChain confirms 100% authentic origin match.",
];

export function RealWorldStoryExample() {
    return (
        <section className="py-24 relative bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        PRACTICAL EXAMPLE
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        See It in <span className="text-gradient-cyan">Action.</span>
                    </h2>
                    <p className="text-base text-zinc-300">
                        Follow Elena&apos;s journey from creating digital artwork to global verification trust.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STORY_STEPS.map((step, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md space-y-2 text-xs font-mono text-zinc-300"
                        >
                            <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                                <span>STEP 0{idx + 1}</span>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <p>{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
