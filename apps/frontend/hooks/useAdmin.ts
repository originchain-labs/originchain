"use client";

import { useState, useEffect } from "react";
import { getAdminAnalytics } from "@/lib/api-client";
import { getSession } from "@/lib/session";

export type AdminAnalytics = {
    totalCreators: number;
    totalAssets: number;
    totalReviews: number;
};

export function useAdmin() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const session = getSession();
        if (!session) {
            setError("Please sign in to view admin analytics");
            setLoading(false);
            return;
        }

        getAdminAnalytics(session.token)
            .then((data) => {
                if (data === null) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                    setAnalytics(data);
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load admin analytics");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { analytics, isAdmin, loading, error };
}
