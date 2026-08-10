"use client";

import { useState } from "react";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function CreateProfilePage() {
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const { createProfile, isSubmitting, error } = useCreatorProfile();

    return (
        <RequireAuth>
            <div className="mx-auto max-w-md p-6">
                <h1 className="mb-4 text-xl font-semibold">Create your profile</h1>
                <input
                    className="mb-3 w-full rounded border p-2"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <textarea
                    className="mb-3 w-full rounded border p-2"
                    placeholder="Bio (optional)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                <button
                    onClick={() => createProfile(displayName, bio || undefined)}
                    disabled={isSubmitting || !displayName}
                    className="w-full rounded bg-zinc-950 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
                >
                    {isSubmitting ? "Creating..." : "Create Profile"}
                </button>
            </div>
        </RequireAuth>
    );
}