"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { motion } from "framer-motion";
import { Shield, Users, FileCheck, MessageSquare, Loader2, AlertTriangle, Lock } from "lucide-react";

const adminStats = [
    { key: "totalCreators", label: "Total Creators", icon: Users, gradient: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400" },
    { key: "totalAssets", label: "Total Assets", icon: FileCheck, gradient: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400" },
    { key: "totalReviews", label: "Total Reviews", icon: MessageSquare, gradient: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400" },
] as const;

export default function AdminPage() {
    const { analytics, isAdmin, loading, error } = useAdmin();

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#030712] text-zinc-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    </div>
                    <p className="text-sm text-zinc-500">Loading admin analytics…</p>
                </div>
            </div>
        );
    }

    return (
        <RequireAuth>
            <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/8 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-28">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest mb-4">
                            <Shield className="w-3.5 h-3.5" />
                            ADMIN PANEL
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Analytics</span>
                        </h1>
                    </motion.div>

                    {/* Error */}
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-400 font-mono mb-6">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}

                    {isAdmin === false ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                                <Lock className="w-7 h-7 text-amber-400" />
                            </div>
                            <p className="text-sm text-amber-300 mb-1">Access Denied</p>
                            <p className="text-xs text-zinc-500">You do not have admin access.</p>
                        </motion.div>
                    ) : analytics ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {adminStats.map((card, i) => {
                                const Icon = card.icon;
                                const value = analytics[card.key as keyof typeof analytics];
                                return (
                                    <motion.div
                                        key={card.key}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + i * 0.05 }}
                                        className={`relative rounded-2xl border ${card.border} bg-gradient-to-b ${card.gradient} backdrop-blur-xl p-6 overflow-hidden`}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <Icon className={`w-5 h-5 ${card.text} mb-3`} />
                                        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                                        <p className="text-xs text-zinc-500 mt-1 font-mono tracking-wider">{card.label}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </div>
        </RequireAuth>
    );
}
