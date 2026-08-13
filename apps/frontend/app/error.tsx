"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[OriginChain Client Error]:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-rose-500/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                        SYSTEM RECOVERY
                    </span>
                    <h1 className="text-2xl font-extrabold text-white">OriginChain Platform Active</h1>
                    <p className="text-xs text-zinc-400 font-mono">
                        {error?.message || "Temporary network initialization. Click retry to reload session."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={() => reset()}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-lg hover:brightness-110 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Session
                    </button>
                    <Link
                        href="/"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-xs font-mono hover:bg-slate-800 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
