import { notFound } from "next/navigation";
import { getAsset, getCertificate } from "@/lib/api-client";
import { ReputationBadge } from "@/components/creator/ReputationBadge";
import { Hash, Shield, Clock, FileText, ExternalLink, Award } from "lucide-react";

export default async function AssetDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const asset = await getAsset(id);

    if (!asset) {
        notFound();
    }

    const certificate = await getCertificate(id).catch(() => null);

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-2xl px-6 pb-20 pt-28">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest mb-6">
                    <Shield className="w-3.5 h-3.5" />
                    ON-CHAIN VERIFIED
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{asset.title}</h1>
                <p className="text-sm text-zinc-400 mb-6">by <span className="text-cyan-400">{asset.creator.displayName}</span></p>

                {/* Reputation */}
                <div className="mb-8">
                    <ReputationBadge creatorId={asset.creator.id} />
                </div>

                {/* Details Card */}
                <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Hash className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-0.5">Content Hash</p>
                                <p className="text-xs text-zinc-300 break-all font-mono">{asset.contentHash}</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-0.5">Registered</p>
                                <p className="text-xs text-zinc-300">{new Date(asset.registeredAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-0.5">Transaction</p>
                                <p className="text-xs text-zinc-300 break-all font-mono">{asset.txHash}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate Button */}
                {certificate && (
                    <a
                        href={certificate.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:brightness-110 transition-all"
                    >
                        <Award className="w-4 h-4" />
                        View Certificate
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
        </div>
    );
}