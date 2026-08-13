"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { getCreatorProfile, updateCreatorProfile } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { motion } from "framer-motion";
import { User, FileText, Pencil, Save, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function EditProfilePage() {
    const [session, setSession] = useState<{ token: string; walletAddress: string; creatorId: string } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const currentSession = getSession();
        setSession(currentSession);

        if (currentSession?.creatorId) {
            getCreatorProfile(currentSession.creatorId)
                .then((profile) => {
                    if (profile) {
                        setDisplayName(profile.displayName || "");
                        setBio(profile.bio || "");
                    }
                })
                .catch((err) => {
                    setStatusMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load profile" });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (!isMounted || isLoading) {
        return (
            <div className="relative min-h-screen bg-[#030712] text-zinc-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                    </div>
                    <p className="text-sm text-zinc-500">Loading profile...</p>
                </div>
            </div>
        );
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        setIsSaving(true);
        setStatusMessage(null);

        try {
            await updateCreatorProfile(
                session.creatorId,
                { displayName, bio: bio || undefined },
                session.token
            );
            setStatusMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setStatusMessage({
                type: "error",
                text: err instanceof Error ? err.message : "Failed to update profile",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <RequireAuth>
            <div className="relative min-h-screen bg-[#030712] text-zinc-100 overflow-hidden">
                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/8 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-lg px-6 pb-20 pt-28">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono tracking-widest mb-4">
                            <Pencil className="w-3.5 h-3.5" />
                            EDIT PROFILE
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Update Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Identity</span>
                        </h1>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                        <form onSubmit={handleSave} className="p-8 space-y-5">
                            {/* Display Name */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono tracking-wider mb-2 block">DISPLAY NAME</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-violet-500/5 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                                        placeholder="Display Name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="text-xs text-zinc-400 font-mono tracking-wider mb-2 block">BIO</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-3 text-zinc-500">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <textarea
                                        rows={4}
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/40 focus:bg-violet-500/5 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                                        placeholder="Tell the community about yourself..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status Message */}
                            {statusMessage && (
                                <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-mono ${
                                    statusMessage.type === "success"
                                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                        : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                                }`}>
                                    {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    {statusMessage.text}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSaving || !displayName.trim()}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                {isSaving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Profile</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </RequireAuth>
    );
}
