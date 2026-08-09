"use client";

import { useState } from "react";
import { hashFile } from "@/lib/hash";
import { verifyAsset } from "@/lib/api-client";

export default function VerifyPage() {
    const [result, setResult] = useState<Awaited<ReturnType<typeof verifyAsset>> | null>(null);
    const [checking, setChecking] = useState(false);
    const [manualHash, setManualHash] = useState("");

    async function checkFile(file: File) {
        setChecking(true);
        try {
            const hash = await hashFile(file);
            const res = await verifyAsset({ hash });
            setResult(res);
        } catch {
            setResult({ verified: false });
        } finally {
            setChecking(false);
        }
    }

    async function checkHash() {
        if (!manualHash) return;
        setChecking(true);
        try {
            const res = await verifyAsset({ hash: manualHash });
            setResult(res);
        } catch {
            setResult({ verified: false });
        } finally {
            setChecking(false);
        }
    }

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-2 text-xl font-semibold">Verify an Asset</h1>
            <p className="mb-6 text-sm text-zinc-500">
                No wallet required. Upload a file to check if it's registered, or paste a known content hash.
            </p>

            <input
                type="file"
                onChange={(e) => e.target.files?.[0] && checkFile(e.target.files[0])}
                className="mb-4 w-full"
            />

            <div className="mb-6 flex gap-2">
                <input
                    className="flex-1 rounded border p-2 text-sm"
                    placeholder="0x... content hash"
                    value={manualHash}
                    onChange={(e) => setManualHash(e.target.value)}
                />
                <button onClick={checkHash} className="rounded bg-zinc-950 px-4 py-2 text-sm text-white">
                    Check
                </button>
            </div>

            {checking && <p className="text-sm text-zinc-500">Checking...</p>}

            {result && !checking && (
                <div className={`rounded border p-4 ${result.verified ? "border-green-600" : "border-red-600"}`}>
                    {result.verified ? (
                        <>
                            <p className="mb-2 font-medium text-green-700">✓ Verified</p>
                            <p className="text-sm">{result.asset?.title}</p>
                            <p className="text-sm text-zinc-500">by {result.creatorDisplayName}</p>
                            <p className="mt-2 break-all text-xs text-zinc-500">
                                Registered: {result.asset && new Date(result.asset.registeredAt).toLocaleString()}
                            </p>
                        </>
                    ) : (
                        <p className="font-medium text-red-700">✗ Not Verified — no matching registration found</p>
                    )}
                </div>
            )}
        </div>
    );
}