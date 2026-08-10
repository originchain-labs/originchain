import { notFound } from "next/navigation";
import Link from "next/link";
import { getCreatorProfile, listAssets } from "@/lib/api-client";
import { ReputationBadge } from "@/components/creator/ReputationBadge";

export default async function CreatorProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const profile = await getCreatorProfile(id);

    if (!profile) {
        notFound();
    }

    const assetsData = await listAssets({ creatorId: id }).catch(() => ({ results: [], total: 0 }));
    const assets = assetsData.results || [];

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-8 border-b border-zinc-200 pb-6">
                <h1 className="text-2xl font-bold text-zinc-900">{profile.displayName}</h1>
                <p className="mb-3 text-xs font-mono text-zinc-500">{profile.walletAddress}</p>
                <div className="mb-4">
                    <ReputationBadge creatorId={profile.id} />
                </div>
                {profile.bio && (
                    <p className="text-sm text-zinc-700">{profile.bio}</p>
                )}
            </div>

            <div>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900">Portfolio & Assets</h2>
                {assets.length === 0 ? (
                    <p className="text-sm text-zinc-500">No assets published yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {assets.map((asset: { id: string; title: string; registeredAt?: string }) => (
                            <Link
                                key={asset.id}
                                href={`/assets/${asset.id}`}
                                className="block rounded border border-zinc-200 p-4 transition-colors hover:border-zinc-400"
                            >
                                <h3 className="font-medium text-zinc-900">{asset.title}</h3>
                                {asset.registeredAt && (
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {new Date(asset.registeredAt).toLocaleDateString()}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
