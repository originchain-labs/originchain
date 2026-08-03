"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
    const { isConnected, isAuthenticated, isSigningIn, error, signIn } = useAuth();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
            <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
                OriginChain
            </Link>
            <div className="flex items-center gap-3">
                {isConnected && !isAuthenticated && (
                    <button
                        onClick={signIn}
                        disabled={isSigningIn}
                        className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
                    >
                        {isSigningIn ? "Check wallet..." : "Sign In"}
                    </button>
                )}
                {error && <span className="text-sm text-red-600">{error}</span>}
                <ConnectButton />
            </div>
        </header>
    );
}