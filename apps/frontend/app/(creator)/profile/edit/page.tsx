"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { getCreatorProfile, updateCreatorProfile } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/RequireAuth";

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
            <div className="mx-auto max-w-md px-6 pb-6 pt-24 text-sm text-zinc-500">
                Loading profile...
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
            <div className="mx-auto max-w-md px-6 pb-6 pt-24">
                <h1 className="mb-4 text-xl font-semibold text-zinc-900">Edit Profile</h1>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">Display Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded border border-zinc-300 p-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">Bio</label>
                        <textarea
                            rows={4}
                            className="w-full rounded border border-zinc-300 p-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
                            placeholder="Tell the community about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    {statusMessage && (
                        <div
                            className={`rounded p-3 text-sm ${
                                statusMessage.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {statusMessage.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving || !displayName.trim()}
                        className="w-full rounded bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
                    >
                        {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </RequireAuth>
    );
}
