"use client";

import Link from "next/link";
import { Hexagon, ShieldCheck } from "lucide-react";

export function Footer() {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Assets", href: "/assets" },
        { name: "Creators", href: "/creators" },
        { name: "Verify", href: "/verify" },
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
                <div className="md:col-span-4 flex flex-wrap gap-6 md:justify-center text-xs font-mono">
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

                {/* Right Copyright */}
                <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-3 text-xs font-mono">
                    <p className="text-zinc-500 text-[11px]">
                        © 2026 OriginChain. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}
