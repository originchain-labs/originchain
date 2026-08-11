"use client";

import { useState, useEffect, useCallback } from "react";
import { getMyOrganizations, createOrganization, updateOrganization } from "@/lib/api-client";
import { getSession } from "@/lib/session";

export type Organization = {
    id: string;
    name: string;
    ownerId: string;
    walletAddress: string | null;
    createdAt: string;
};

export function useOrganization() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);

    const loadOrgs = useCallback(async () => {
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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load organization");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrgs();
    }, [loadOrgs]);

    const createOrg = useCallback(
        async (name: string): Promise<boolean> => {
            const session = getSession();
            if (!session || !name.trim()) return false;

            try {
                setIsCreating(true);
                setError(null);
                await createOrganization(name.trim(), session.token);
                await loadOrgs();
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to create organization");
                return false;
            } finally {
                setIsCreating(false);
            }
        },
        [loadOrgs]
    );

    const updateOrg = useCallback(
        async (id: string, name: string): Promise<boolean> => {
            const session = getSession();
            if (!session || !name.trim()) return false;

            try {
                setIsUpdating(true);
                setUpdateMessage(null);
                setError(null);
                await updateOrganization(id, name.trim(), session.token);
                setUpdateMessage("Organization name updated successfully!");
                await loadOrgs();
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to update organization");
                return false;
            } finally {
                setIsUpdating(false);
            }
        },
        [loadOrgs]
    );

    return {
        organizations,
        loading,
        error,
        isCreating,
        isUpdating,
        updateMessage,
        createOrg,
        updateOrg,
        reload: loadOrgs,
    };
}
