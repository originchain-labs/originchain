"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminPage() {
    const { analytics, isAdmin, loading, error } = useAdmin();

    if (loading) {
        return <div className="p-6 text-sm text-zinc-500">Loading admin analytics…</div>;
    }

    return (
        <RequireAuth>
            <div className="mx-auto max-w-4xl p-6">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Admin Analytics
                </h1>

                {error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                        {error}
                    </div>
                )}

                {isAdmin === false ? (
                    <div className="rounded border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        You do not have admin access.
                    </div>
                ) : analytics ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
                            <p className="text-xs text-zinc-500">Total Creators</p>
                            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {analytics.totalCreators}
                            </p>
                        </div>
                        <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
                            <p className="text-xs text-zinc-500">Total Assets</p>
                            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {analytics.totalAssets}
                            </p>
                        </div>
                        <div className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
                            <p className="text-xs text-zinc-500">Total Reviews</p>
                            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {analytics.totalReviews}
                            </p>
                        </div>
                    </div>
                ) : null}
            </div>
        </RequireAuth>
    );
}
