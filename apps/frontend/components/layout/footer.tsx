"use client";

import Link from "next/link";
import { Hexagon, ShieldCheck } from "lucide-react";

export function Footer() {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Assets", href: "/assets" },
        { name: "Creators", href: "/creators" },
        { name: "Verify", href: "/verify" },
        { name: "Dashboard", href: "/dashboard" },
    ];

    return (
        <footer className="bg-[#02050e] border-t border-white/10 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Brand Identity */}
                <div className="md:col-span-5 space-y-3">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                            <Hexagon className="w-5 h-5 fill-cyan-500/10" />
                            <ShieldCheck className="w-3 h-3 text-cyan-300 absolute" />
                        </div>
                        <span className="font-bold text-base tracking-wider text-white font-mono">
                            ORIGIN<span className="text-cyan-400">CHAIN</span>
                        </span>
                    </Link>
                    <p className="text-xs text-cyan-300/80 font-mono font-medium">
                        Own Your Creativity. Prove Your Origin.
                    </p>
                    <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                        Decentralized proof-of-origin platform empowering creators with blockchain provenance and public cryptographic verification.
                    </p>
                </div>

                {/* Center Navigation */}
                <div className="md:col-span-4 flex flex-wrap gap-4 md:justify-center text-xs font-mono">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-zinc-400 hover:text-cyan-300 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Developer Links & Copyright */}
                <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                        <a
                            href="https://github.com/originchain-labs/originchain"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-zinc-400 hover:text-white transition-all"
                            aria-label="GitHub Repository"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    </div>

                    <p className="text-zinc-500 text-[11px]">
                        © 2026 OriginChain. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}


