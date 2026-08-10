"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { reviewRegistryAbi } from "@originchain/shared-types/contracts/reviewRegistry";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import { wagmiConfig } from "@/lib/wagmi-config";
import { submitReviewToBackend } from "@/lib/api-client";
import { getSession } from "@/lib/session";

const REVIEW_REGISTRY = CONTRACT_ADDRESSES.arbitrumSepolia.reviewRegistry as `0x${string}`;
const CREATOR_REGISTRY = CONTRACT_ADDRESSES.arbitrumSepolia.creatorRegistry as `0x${string}`;
const ASSET_REGISTRY = CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`;

type PendingSubmission = {
    assetId: string;
    rating: number;
    comment: string | undefined;
    txHash: `0x${string}`;
};

export function useReview() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Set once the on-chain tx succeeds, cleared once the backend POST succeeds.
    // Lets a failed backend submission be retried on its own — the on-chain
    // review already happened by then, so resubmitting the whole flow would
    // attempt a second on-chain submitReview for the same asset+reviewer and
    // revert (AlreadyReviewed), burning gas for nothing.
    const [pendingSubmission, setPendingSubmission] = useState<PendingSubmission | null>(null);

    const submitToBackend = useCallback(async (token: string, data: PendingSubmission) => {
        try {
            await submitReviewToBackend(data, token);
            setPendingSubmission(null);
            return true;
        } catch (err) {
            // The on-chain tx already succeeded — this is a partial success, not
            // a failed review. Keep the data needed to retry just this step.
            setPendingSubmission(data);
            const detail = err instanceof Error ? err.message : "please retry.";
            setError(`Your review was recorded on-chain (tx ${data.txHash}), but saving it failed: ${detail}`);
            return false;
        }
    }, []);

    const submitReview = useCallback(
        async (assetId: string, assetContentHash: string, rating: number, comment: string) => {
            const session = getSession();
            if (!session || !address) {
                setError("Not authenticated");
                return false;
            }
            setSubmitting(true);
            setError(null);

            try {
                const txHash = await writeContractAsync({
                    address: REVIEW_REGISTRY,
                    abi: reviewRegistryAbi,
                    functionName: "submitReview",
                    args: [assetContentHash as `0x${string}`, rating, comment || "", CREATOR_REGISTRY, ASSET_REGISTRY],
                });

                // writeContractAsync resolves once the wallet broadcasts the tx,
                // not once it's mined. The backend requires a mined, successful
                // receipt, so wait for it here first — and check status, since a
                // reverted tx (e.g. AlreadyReviewed, SelfReviewNotAllowed) still
                // resolves normally rather than throwing.
                const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: txHash });
                if (receipt.status !== "success") {
                    throw new Error("On-chain transaction failed");
                }

                const data = { assetId, rating, comment: comment || undefined, txHash };
                return await submitToBackend(session.token, data);
            } catch (err) {
                // Only reachable for failures before the on-chain tx succeeded
                // (signing/broadcast/mining) — safe to retry from scratch.
                setError(err instanceof Error ? err.message : "Review submission failed");
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [address, writeContractAsync, submitToBackend]
    );

    const retrySubmission = useCallback(async () => {
        const session = getSession();
        if (!session || !pendingSubmission) return false;
        setSubmitting(true);
        setError(null);
        const ok = await submitToBackend(session.token, pendingSubmission);
        setSubmitting(false);
        return ok;
    }, [pendingSubmission, submitToBackend]);

    return { submitReview, submitting, error, pendingSubmission, retrySubmission };
}
