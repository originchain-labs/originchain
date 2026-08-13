"use client";

import { useState } from "react";
import Link from "next/link";
import { search } from "@/lib/api-client";

export default function SearchPage() {
    const [q, setQ] = useState("");
    const [results, setResults] = useState<Awaited<ReturnType<typeof search>> | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch() {
        setError(null);
        try {
            const data = await search(q);
            setResults(data);
        } catch {
            setError("Search failed. Try again.");
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-6 pb-6 pt-24">
            <h1 className="mb-4 text-xl font-semibold">Search</h1>
            <div className="mb-6 flex gap-2">
                <input
                    className="flex-1 rounded border p-2"
                    placeholder="Search creators or assets…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch} className="rounded bg-zinc-950 px-4 py-2 text-white">
                    Search
                </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {results && (
                <div>
                    {results.creators.length > 0 && (
                        <div className="mb-6">
                            <h2 className="mb-2 text-sm font-medium">Creators</h2>
                            {results.creators.map((c) => (
                                <Link key={c.id} href={`/creators/${c.id}`} className="block rounded border p-2 mb-2 hover:border-zinc-400">
                                    {c.displayName}
                                </Link>
                            ))}
                        </div>
                    )}
                    {results.assets.length > 0 && (
                        <div>
                            <h2 className="mb-2 text-sm font-medium">Assets</h2>
                            {results.assets.map((a) => (
                                <Link key={a.id} href={`/assets/${a.id}`} className="block rounded border p-2 mb-2 hover:border-zinc-400">
                                    {a.title} <span className="text-xs text-zinc-500">by {a.creator.displayName}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                    {results.assets.length === 0 && results.creators.length === 0 && (
                        <p className="text-sm text-zinc-500">No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
}