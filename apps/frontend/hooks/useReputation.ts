"use client";

import { useState, useEffect } from "react";
import { getCreatorReputation } from "@/lib/api-client";

export type ReputationData = Awaited<ReturnType<typeof getCreatorReputation>>;

export function useReputation(creatorId: string) {
    const [reputation, setReputation] = useState<ReputationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!creatorId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(false);
        getCreatorReputation(creatorId)
            .then((data) => {
                setReputation(data);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [creatorId]);

    return { reputation, loading, error };
}
