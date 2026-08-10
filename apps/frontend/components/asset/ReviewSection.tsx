"use client";

import { useState, useEffect } from "react";
import { useReview } from "@/hooks/useReview";
import { getAssetReviews } from "@/lib/api-client";

export function ReviewSection({ assetId, contentHash }: { assetId: string; contentHash: string }) {
    const [reviews, setReviews] = useState<Awaited<ReturnType<typeof getAssetReviews>> | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { submitReview, submitting, error, pendingSubmission, retrySubmission } = useReview();

    async function loadReviews() {
        try {
            const data = await getAssetReviews(assetId);
            setReviews(data);
            setLoadError(false);
        } catch {
            setLoadError(true);
        }
    }

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetId]);

    async function handleSubmit() {
        const ok = await submitReview(assetId, contentHash, rating, comment);
        if (ok) {
            setComment("");
            loadReviews();
        }
    }

    async function handleRetry() {
        const ok = await retrySubmission();
        if (ok) {
            setComment("");
            loadReviews();
        }
    }

    return (
        <div className="mt-8 border-t pt-6">
            <h2 className="mb-3 text-lg font-semibold">
                Reviews {reviews?.total ? `(${reviews.total})` : ""}
                {reviews?.averageRating != null && (
                    <span className="ml-2 text-sm font-normal text-zinc-500">
                        avg {reviews.averageRating.toFixed(1)}/5
                    </span>
                )}
            </h2>

            <div className="mb-6 rounded border p-3">
                {pendingSubmission ? (
                    <div>
                        <p className="mb-3 text-sm text-amber-600">
                            Your review was recorded on-chain, but we couldn&apos;t save it yet. It&apos;s safe to
                            retry — this won&apos;t submit another on-chain transaction.
                        </p>
                        <button
                            onClick={handleRetry}
                            disabled={submitting}
                            className="rounded bg-zinc-950 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                            {submitting ? "Retrying..." : "Retry Saving"}
                        </button>
                    </div>
                ) : (
                    <>
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mb-2 rounded border p-1">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r}>{r} stars</option>
                            ))}
                        </select>
                        <textarea
                            className="mb-2 w-full rounded border p-2 text-sm"
                            placeholder="Optional comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="rounded bg-zinc-950 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </>
                )}
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>

            {loadError && <p className="text-sm text-red-600">Couldn&apos;t load reviews. Please refresh to try again.</p>}

            {reviews?.results.map((r, i) => (
                <div key={i} className="mb-3 border-b pb-3 text-sm">
                    <p className="font-medium">{r.rating} stars — {r.reviewer.displayName}</p>
                    {r.comment && <p className="text-zinc-600">{r.comment}</p>}
                </div>
            ))}
        </div>
    );
}
