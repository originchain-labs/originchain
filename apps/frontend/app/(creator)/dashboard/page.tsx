"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { LineChart } from "@/components/charts/line-chart";
import { Line } from "@/components/charts/line";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import { motion } from "framer-motion";
import { BarChart3, Star, Shield, FileCheck, Sparkles, Loader2, AlertTriangle, TrendingUp, MessageSquare } from "lucide-react";

const statCards = [
    { key: "totalAssets", label: "Assets", icon: FileCheck, gradient: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
    { key: "totalReviews", label: "Reviews", icon: MessageSquare, gradient: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400", glow: "shadow-violet-500/10" },
    { key: "averageRating", label: "Avg Rating", icon: Star, gradient: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/10" },
    { key: "reputationScore", label: "Reputation", icon: Shield, gradient: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
] as const;

export default function DashboardPage() {
    const { insights, error, loading } = useAnalytics();

    if (error) return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
                <p className="text-sm text-rose-400 max-w-sm">{error}</p>
            </div>
        </div>
    );

    if (loading || !insights) return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
                <p className="text-sm text-zinc-500">Loading your dashboard…</p>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-28">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest mb-4">
                        <BarChart3 className="w-3.5 h-3.5" />
                        CREATOR ANALYTICS
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Dashboard</span>
                    </h1>
                </motion.div>

                {/* AI Summary */}
                {insights.aiSummary && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative rounded-2xl border border-violet-500/20 bg-violet-500/5 backdrop-blur-xl p-5 mb-8 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-violet-400 font-mono mb-1.5">AI-Powered Summary</p>
                                <p className="text-sm text-zinc-300 leading-relaxed">{insights.aiSummary}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {statCards.map((card, i) => {
                        const Icon = card.icon;
                        const value = card.key === "averageRating"
                            ? insights.averageRating?.toFixed(1) ?? "—"
                            : insights[card.key];
                        return (
                            <motion.div
                                key={card.key}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + i * 0.05 }}
                                className={`relative rounded-2xl border ${card.border} bg-gradient-to-b ${card.gradient} backdrop-blur-xl p-5 overflow-hidden shadow-lg ${card.glow}`}
                            >
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className={`w-5 h-5 ${card.text}`} />
                                </div>
                                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                                <p className="text-xs text-zinc-500 mt-1 font-mono tracking-wider">{card.label}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                            <h2 className="text-sm font-medium text-zinc-300">Assets Over Time</h2>
                        </div>
                        <LineChart data={insights.assetsOverTime} xDataKey="date" style={{ height: 200 }}>
                            <Grid />
                            <XAxis />
                            <Line dataKey="count" />
                            <ChartTooltip />
                        </LineChart>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-violet-400" />
                            <h2 className="text-sm font-medium text-zinc-300">Reviews Over Time</h2>
                        </div>
                        <LineChart data={insights.reviewsOverTime} xDataKey="date" style={{ height: 200 }}>
                            <Grid />
                            <XAxis />
                            <Line dataKey="count" />
                            <ChartTooltip />
                        </LineChart>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}