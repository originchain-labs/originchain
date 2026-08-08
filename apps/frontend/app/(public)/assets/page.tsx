import Link from "next/link";
import { listAssets } from "@/lib/api-client";

export default async function AssetsPage({ searchParams }: { searchParams: Promise<{ creatorId?: string }> }) {
    const { creatorId } = await searchParams;
    const { results } = await listAssets({ creatorId });

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h1 className="mb-6 text-xl font-semibold">Registered Assets</h1>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {results.map((asset: any) => (
                    <Link
                        key={asset.id}
                        href={`/assets/${asset.id}`}
                        className="rounded border p-3 hover:border-zinc-400"
                    >
                        <p className="truncate font-medium">{asset.title}</p>
                        <p className="truncate text-xs text-zinc-500">{asset.creator.displayName}</p>
                    </Link>
                ))}
            </div>
            {results.length === 0 && <p className="text-zinc-500">No assets registered yet.</p>}
        </div>
    );
}