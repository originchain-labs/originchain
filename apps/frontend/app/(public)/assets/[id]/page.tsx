import { notFound } from "next/navigation";
import { getAsset, getCertificate } from "@/lib/api-client";

export default async function AssetDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const asset = await getAsset(id);

    if (!asset) {
        notFound();
    }

    const certificate = asset.proofId ? await getCertificate(id) : null;

    return (
        <div className="mx-auto max-w-xl p-6">
            <h1 className="mb-2 text-xl font-semibold">{asset.title}</h1>
            <p className="mb-4 text-sm text-zinc-500">by {asset.creator.displayName}</p>
            <p className="mb-1 break-all text-xs text-zinc-500">
                Content hash: {asset.contentHash}
            </p>
            <p className="mb-1 break-all text-xs text-zinc-500">
                Registered: {new Date(asset.registeredAt).toLocaleString()}
            </p>
            <p className="mb-4 break-all text-xs text-zinc-500">Tx: {asset.txHash}</p>
            {certificate && (
                <a
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-zinc-950 px-4 py-2 text-sm text-white"
                >
                    View Certificate
                </a>
            )}
        </div>
    );
}