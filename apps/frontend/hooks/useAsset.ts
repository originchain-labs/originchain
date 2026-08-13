"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { assetRegistryAbi } from "@/lib/shared-types/contracts/assetRegistry";
import { CONTRACT_ADDRESSES } from "@/lib/shared-types/constants";
import { hashFile } from "@/lib/hash";
import { prepareAsset, finalizeAssetMetadata, confirmAssetRegistration, devRegisterAsset } from "@/lib/api-client";
import { getSession, saveSession } from "@/lib/session";
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

function ensureActiveSession(address?: string) {
    let session = getSession();
    if (!session) {
        const wallet = address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        saveSession("dev-demo-token", wallet, "creator-demo-id");
        session = { token: "dev-demo-token", walletAddress: wallet, creatorId: "creator-demo-id" };
    }
    return session;
}

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
        pHash?: string;
        similarityWarning?: { matchedTitle: string; similarityScore: number; creatorName: string } | null;
    } | null>(null);
    const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);

    const selectAndPrepare = useCallback(async (file: File, draftTitle: string, draftDescription: string) => {
        const session = ensureActiveSession(address);
        setError(null);
        setStep("hashing");

        try {
            const clientHash = await hashFile(file);

            setStep("preparing");
            const res = await prepareAsset(
                file,
                draftTitle,
                draftDescription,
                session.token
            ) as {
                contentHash: string;
                ipfsCid: string;
                suggestedMetadata?: { title: string; description: string; tags: string[] } | null;
                pHash?: string;
                similarityWarning?: { matchedTitle: string; similarityScore: number; creatorName: string } | null;
            };

            const { contentHash, ipfsCid, suggestedMetadata, pHash, similarityWarning } = res;

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
                pHash,
                similarityWarning,
            });
            setStep("review");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to prepare asset");
            setStep("idle");
        }
    }, [address]);

    const submitConfirmation = useCallback(async (token: string, data: PendingConfirmation) => {
        setStep("confirming");
        try {
            await confirmAssetRegistration(data, token);
            setPendingConfirmation(null);
            setStep("done");
        } catch (err) {
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
            const session = ensureActiveSession(address);
            if (!preview) return;

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
                setError(err instanceof Error ? err.message : "Registration failed");
                setStep("review");
            }
        },
        [address, preview, writeContractAsync, submitConfirmation]
    );

    /**
     * Dev-mode registration — skips on-chain transaction entirely.
     * Registers directly in the database. Free, no gas needed.
     */
    const devConfirmAndRegister = useCallback(
        async (finalTitle: string, finalDescription: string, finalTags: string[]) => {
            const session = ensureActiveSession(address);
            if (!preview) return;

            setError(null);
            try {
                setStep("preparing");
                const { metadataCid } = await finalizeAssetMetadata(
                    { title: finalTitle, description: finalDescription, tags: finalTags },
                    session.token
                );

                setStep("confirming");
                await devRegisterAsset(
                    {
                        contentHash: preview.contentHash,
                        ipfsCid: preview.ipfsCid,
                        metadataCid,
                        finalMetadata: { title: finalTitle, description: finalDescription, tags: finalTags },
                        pHash: preview.pHash,
                    },
                    session.token
                );

                setStep("done");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Registration failed");
                setStep("review");
            }
        },
        [address, preview]
    );

    const retryConfirmation = useCallback(async () => {
        const session = ensureActiveSession(address);
        if (!pendingConfirmation) return;
        setError(null);
        await submitConfirmation(session.token, pendingConfirmation);
    }, [address, pendingConfirmation, submitConfirmation]);

    return { step, error, preview, selectAndPrepare, confirmAndRegister, devConfirmAndRegister, retryConfirmation };
}