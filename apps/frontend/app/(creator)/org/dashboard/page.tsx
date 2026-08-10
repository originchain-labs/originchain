"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { getMyOrganizations, createOrganization, updateOrganization } from "@/lib/api-client";
import { RequireAuth } from "@/components/auth/RequireAuth";

type Organization = {
    id: string;
    name: string;
    ownerId: string;
    walletAddress: string | null;
    createdAt: string;
};

export default function OrgDashboardPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createName, setCreateName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [editName, setEditName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);

    const loadOrgs = async () => {
        const session = getSession();
        if (!session) {
            setError("Please sign in to view your organization dashboard");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await getMyOrganizations(session.token);
            setOrganizations(res.organizations);
            if (res.organizations.length > 0) {
                setEditName(res.organizations[0].name);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load organization");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrgs();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = getSession();
        if (!session || !createName.trim()) return;

        try {
            setIsCreating(true);
            setError(null);
            await createOrganization(createName.trim(), session.token);
            setCreateName("");
            await loadOrgs();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create organization");
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = getSession();
        if (!session || organizations.length === 0 || !editName.trim()) return;

        const org = organizations[0];
        try {
            setIsUpdating(true);
            setUpdateMessage(null);
            setError(null);
            await updateOrganization(org.id, editName.trim(), session.token);
            setUpdateMessage("Organization name updated successfully!");
            await loadOrgs();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update organization");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-sm text-zinc-500">Loading organization dashboard…</div>;
    }

    const currentOrg = organizations.length > 0 ? organizations[0] : null;

    return (
        <RequireAuth>
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Organization Dashboard
                </h1>

                {error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                        {error}
                    </div>
                )}

                {updateMessage && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                        {updateMessage}
                    </div>
                )}

                {!currentOrg ? (
                    <div className="rounded border border-zinc-200 p-6 dark:border-zinc-800">
                        <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Create an Organization
                        </h2>
                        <p className="mb-4 text-sm text-zinc-500">
                            You currently do not own an organization. Enter a name below to create one.
                        </p>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    placeholder="e.g. Acme Studios"
                                    required
                                    className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                {isCreating ? "Creating…" : "Create Organization"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6 rounded border border-zinc-200 p-6 dark:border-zinc-800">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                {currentOrg.name}
                            </h2>
                            <p className="mt-1 text-xs text-zinc-500">
                                Organization ID: {currentOrg.id}
                            </p>
                            <p className="text-xs text-zinc-500">
                                Created: {new Date(currentOrg.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                    Edit Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="rounded bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                {isUpdating ? "Saving…" : "Save Changes"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
