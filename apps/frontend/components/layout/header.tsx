"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
            <Link
                href="/"
                className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
                OriginChain
            </Link>
            <ConnectButton />
        </header>
    );
}