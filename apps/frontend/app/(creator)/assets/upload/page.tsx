"use client";

import { useState } from "react";
import { useAsset } from "@/hooks/useAsset";

export default function UploadAssetPage() {
    const [file, setFile] = useState<File | null>(null);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftDescription, setDraftDescription] = useState("");
    const [finalTitle, setFinalTitle] = useState("");
    const [finalDescription, setFinalDescription] = useState("");
    const [finalTags, setFinalTags] = useState("");

    const { step, error, preview, selectAndPrepare, confirmAndRegister, retryConfirmation } = useAsset();

    return (
        <div className="mx-auto max-w-xl px-6 pb-6 pt-24">
            <h1 className="mb-4 text-xl font-semibold">Register an Asset</h1>

            {step === "idle" && (
                <div>
                    <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mb-3 w-full" />
                    <input
                        className="mb-3 w-full rounded border p-2"
                        placeholder="Title (draft)"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                    />
                    <textarea
                        className="mb-3 w-full rounded border p-2"
                        placeholder="Description (draft, optional)"
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                    />
                    <button
                        onClick={() => file && selectAndPrepare(file, draftTitle, draftDescription)}
                        disabled={!file || !draftTitle}
                        className="w-full rounded bg-zinc-950 px-4 py-2 text-white disabled:opacity-50"
                    >
                        Compute Hash & Prepare
                    </button>
                </div>
            )}

            {(step === "hashing" || step === "preparing") && <p>Working... ({step})</p>}

            {step === "review" && preview && (
                <div>
                    <p className="mb-2 break-all text-xs text-zinc-500">Content hash: {preview.contentHash}</p>
                    <p className="mb-4 break-all text-xs text-zinc-500">IPFS CID: {preview.ipfsCid}</p>
                    <input
                        className="mb-3 w-full rounded border p-2"
                        value={finalTitle || preview.title}
                        onChange={(e) => setFinalTitle(e.target.value)}
                    />
                    <textarea
                        className="mb-3 w-full rounded border p-2"
                        value={finalDescription || preview.description}
                        onChange={(e) => setFinalDescription(e.target.value)}
                    />
                    <input
                        className="mb-3 w-full rounded border p-2"
                        placeholder="Tags (comma separated)"
                        value={finalTags || preview.tags.join(", ")}
                        onChange={(e) => setFinalTags(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            confirmAndRegister(
                                finalTitle || preview.title,
                                finalDescription || preview.description,
                                (finalTags || preview.tags.join(", ")).split(",").map((t) => t.trim()).filter(Boolean)
                            )
                        }
                        className="w-full rounded bg-zinc-950 px-4 py-2 text-white"
                    >
                        Confirm & Register On-Chain
                    </button>
                </div>
            )}

            {(step === "signing" || step === "confirming") && <p>Working... ({step})</p>}
            {step === "confirmFailed" && (
                <div>
                    <p className="mb-3 text-sm text-amber-600">
                        Your asset is registered on-chain, but we couldn&apos;t save it yet. It&apos;s safe to retry —
                        this won&apos;t submit another on-chain transaction.
                    </p>
                    <button
                        onClick={() => retryConfirmation()}
                        className="w-full rounded bg-zinc-950 px-4 py-2 text-white"
                    >
                        Retry Saving
                    </button>
                </div>
            )}
            {step === "done" && <p className="text-green-600">Asset registered successfully!</p>}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
    );
}