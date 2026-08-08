"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { assetRegistryAbi } from "@originchain/shared-types/contracts/assetRegistry";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import { hashFile } from "@/lib/hash";
import { prepareAsset, finalizeAssetMetadata, confirmAssetRegistration } from "@/lib/api-client";
import { getSession } from "@/lib/session";
import { wagmiConfig } from "@/lib/wagmi-config";

const ASSET_REGISTRY = CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`;
const CREATOR_REGISTRY = CONTRACT_ADDRESSES.arbitrumSepolia.creatorRegistry as `0x${string}`;

type Step = "idle" | "hashing" | "preparing" | "review" | "signing" | "confirming" | "confirmFailed" | "done";

type PendingConfirmation = {
    contentHash: string;
    ipfsCid: string;
    metadataCid: string;
    txHash: `0x${string}`;
    finalMetadata: { title: string; description: string; tags: string[] };
};

export function useAsset() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [step, setStep] = useState<Step>("idle");
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<{
        file: File;
        contentHash: string;
        ipfsCid: string;
        title: string;
        description: string;
        tags: string[];
    } | null>(null);
    // Set once the on-chain tx succeeds, cleared once /confirm succeeds. Lets
    // a failed /confirm be retried on its own — the tx already happened by
    // then, so retrying the whole flow would attempt a second on-chain write
    // that reverts (AssetAlreadyExists) and costs the user gas for nothing.
    const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

    const selectAndPrepare = useCallback(async (file: File, draftTitle: string, draftDescription: string) => {
        const session = getSession();
        if (!session || !address) {
            setError("Not authenticated");
            return;
        }
        setError(null);
        setStep("hashing");

        try {
            const clientHash = await hashFile(file);

            setStep("preparing");
            const { contentHash, ipfsCid, suggestedMetadata } = await prepareAsset(
                file,
                draftTitle,
                draftDescription,
                session.token
            );

            // Sanity check: server-recomputed hash should match our client-side one.
            if (clientHash.toLowerCase() !== contentHash.toLowerCase()) {
                throw new Error("Hash mismatch between client and server — please retry");
            }

            setPreview({
                file,
                contentHash,
                ipfsCid,
                title: suggestedMetadata?.title ?? draftTitle,
                description: suggestedMetadata?.description ?? draftDescription,
                tags: suggestedMetadata?.tags ?? [],
            });
            setStep("review");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to prepare asset");
            setStep("idle");
        }
    }, [address]);

    // Shared by the initial confirm attempt and manual retries after a
    // post-tx confirm failure. Never re-signs — by the time this runs, the
    // on-chain write already happened.
    const submitConfirmation = useCallback(async (token: string, data: PendingConfirmation) => {
        setStep("confirming");
        try {
            await confirmAssetRegistration(data, token);
            setPendingConfirmation(null);
            setStep("done");
        } catch (err) {
            // The on-chain tx already succeeded — this is a partial success,
            // not a failed registration. Keep the data needed to retry just
            // this step, and say so plainly, rather than sending the user
            // back to "review" where retrying would resubmit registerAsset
            // for an already-registered hash and revert (AssetAlreadyExists),
            // burning gas for no reason.
            setPendingConfirmation(data);
            const detail = err instanceof Error ? err.message : "please retry.";
            setError(
                `Your asset was registered on-chain (tx ${data.txHash}), but saving it to your account failed: ${detail}`
            );
            setStep("confirmFailed");
        }
    }, []);

    const confirmAndRegister = useCallback(
        async (finalTitle: string, finalDescription: string, finalTags: string[]) => {
            const session = getSession();
            if (!session || !preview) return;

            setError(null);
            try {
                setStep("preparing");
                const { metadataCid } = await finalizeAssetMetadata(
                    { title: finalTitle, description: finalDescription, tags: finalTags },
                    session.token
                );

                setStep("signing");
                const txHash = await writeContractAsync({
                    address: ASSET_REGISTRY,
                    abi: assetRegistryAbi,
                    functionName: "registerAsset",
                    args: [preview.contentHash as `0x${string}`, preview.ipfsCid, metadataCid, CREATOR_REGISTRY],
                });

                // writeContractAsync resolves once the wallet broadcasts the
                // tx, not once it's mined. The backend's /confirm requires a
                // mined receipt, so calling it immediately would race an
                // unconfirmed transaction — wait for it here first.
                setStep("confirming");
                const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: txHash });
                if (receipt.status !== "success") {
                    throw new Error("On-chain transaction failed");
                }

                await submitConfirmation(session.token, {
                    contentHash: preview.contentHash,
                    ipfsCid: preview.ipfsCid,
                    metadataCid,
                    txHash,
                    finalMetadata: { title: finalTitle, description: finalDescription, tags: finalTags },
                });
            } catch (err) {
                // Only reachable for failures before the on-chain tx succeeds
                // (finalize-metadata or the signing/write itself) — safe to
                // send back to "review" for a full retry.
                setError(err instanceof Error ? err.message : "Registration failed");
                setStep("review");
            }
        },
        [preview, writeContractAsync, submitConfirmation]
    );

    const retryConfirmation = useCallback(async () => {
        const session = getSession();
        if (!session || !pendingConfirmation) return;
        setError(null);
        await submitConfirmation(session.token, pendingConfirmation);
    }, [pendingConfirmation, submitConfirmation]);

    return { step, error, preview, selectAndPrepare, confirmAndRegister, retryConfirmation };
}