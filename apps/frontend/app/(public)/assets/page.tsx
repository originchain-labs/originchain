import Link from "next/link";
import { listAssets } from "@/lib/api-client";
import { FileCheck, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ creatorId?: string }> }) {
    const { creatorId } = await searchParams;
    const { results } = await listAssets({ creatorId });

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-28">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest mb-4">
                        <FileCheck className="w-3.5 h-3.5" />
                        BLOCKCHAIN VERIFIED
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        Registered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Assets</span>
                    </h1>
                    <p className="text-sm text-zinc-500">On-chain verified digital creations with immutable proof of origin.</p>
                </div>

                {/* Asset Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {results.map((asset: any) => (
                            <Link
                                key={asset.id}
                                href={`/assets/${asset.id}`}
                                className="group relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-cyan-500/30 transition-colors" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                        <FileCheck className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <p className="truncate font-medium text-white text-sm mb-1">{asset.title}</p>
                                <p className="truncate text-xs text-zinc-500">by {asset.creator.displayName}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center mb-4">
                            <Sparkles className="w-7 h-7 text-zinc-600" />
                        </div>
                        <p className="text-sm text-zinc-500 mb-4">No assets registered yet.</p>
                        <Link href="/assets/upload" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-sm font-bold text-slate-950 hover:brightness-110 transition-all">
                            Register Your First Asset <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}