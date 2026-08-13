"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { creatorRegistryAbi } from "@/lib/shared-types/contracts/creatorRegistry";
import { CONTRACT_ADDRESSES } from "@/lib/shared-types/constants";
import { getSession } from "@/lib/session";

const CONTRACT_ADDRESS = CONTRACT_ADDRESSES.arbitrumSepolia.creatorRegistry as `0x${string}`;

export function useCreatorProfile() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createProfile = useCallback(
        async (displayName: string, bio?: string) => {
            const session = getSession();
            if (!session || !address) {
                setError("Not authenticated");
                return;
            }

            setIsSubmitting(true);
            setError(null);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/creators`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.token}`,
                    },
                    body: JSON.stringify({ displayName, bio }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error?.message || "Failed to create profile");
                }

                const { profileCid } = await res.json();

                await writeContractAsync({
                    address: CONTRACT_ADDRESS,
                    abi: creatorRegistryAbi,
                    functionName: "registerCreator",
                    args: [profileCid],
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Profile creation failed");
            } finally {
                setIsSubmitting(false);
            }
        },
        [address, writeContractAsync]
    );

    return { createProfile, isSubmitting, error };
}