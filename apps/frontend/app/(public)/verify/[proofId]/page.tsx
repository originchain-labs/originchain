import { verifyAsset } from "@/lib/api-client";

export default async function VerifyByProofIdPage({ params }: { params: Promise<{ proofId: string }> }) {
    const { proofId } = await params;
    let result;
    try {
        result = await verifyAsset({ proofId });
    } catch {
        result = { verified: false };
    }

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-xl font-semibold">Verification Result</h1>
            {result.verified ? (
                <div className="rounded border border-green-600 p-4">
                    <p className="mb-2 font-medium text-green-700">✓ Verified</p>
                    <p className="text-sm">{result.asset?.title}</p>
                    <p className="text-sm text-zinc-500">by {result.creatorDisplayName}</p>
                    <p className="mt-2 break-all text-xs text-zinc-500">Hash: {result.asset?.contentHash}</p>
                    <p className="break-all text-xs text-zinc-500">
                        Registered: {result.asset && new Date(result.asset.registeredAt).toLocaleString()}
                    </p>
                    <p className="break-all text-xs text-zinc-500">Tx: {result.asset?.txHash}</p>
                </div>
            ) : (
                <div className="rounded border border-red-600 p-4">
                    <p className="font-medium text-red-700">✗ Not Verified</p>
                    <p className="text-sm text-zinc-500">No matching registration found for this Proof ID.</p>
                </div>
            )}
        </div>
    );
}