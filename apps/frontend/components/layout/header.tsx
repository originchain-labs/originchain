"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, Menu, X, Hexagon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const { isConnected, isAuthenticated, isSigningIn, error, signIn } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Explore", href: "/explore" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Verify", href: "/verify" },
        { name: "Creators", href: "/creators" },
    ];



    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#030712]/80 backdrop-blur-xl border-b border-cyan-500/15 py-3 shadow-lg shadow-black/50"
                    : "bg-transparent py-5 border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left: Brand */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
                        <Hexagon className="w-6 h-6 text-cyan-400 fill-cyan-500/10 group-hover:rotate-12 transition-transform duration-300" />
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-300 absolute" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors font-mono">
                            ORIGIN<span className="text-cyan-400">CHAIN</span>
                        </span>
                        <span className="text-[10px] text-cyan-400/70 tracking-widest -mt-1 font-mono uppercase">
                            Proof of Origin
                        </span>
                    </div>
                </Link>

                {/* Center: Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    isActive
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Wallet Connect & Auth */}
                <div className="hidden sm:flex items-center gap-3">
                    {isConnected && !isAuthenticated && (
                        <button
                            onClick={signIn}
                            disabled={isSigningIn}
                            className="flex items-center gap-2 rounded-full bg-[#06b6d4] text-slate-950 font-bold px-4 py-2 text-xs shadow-lg shadow-cyan-500/25 hover:brightness-110 disabled:opacity-50 transition-all"
                        >
                            {isSigningIn ? "Signing In..." : "Sign In to Account"}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {error && <span className="text-xs text-rose-400 font-mono">{error}</span>}
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                </div>





                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg bg-slate-900/80 border border-white/10 text-zinc-300 hover:text-white"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#030712]/95 border-b border-cyan-500/20 backdrop-blur-2xl px-6 py-6"
                    >
                        <div className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                                {isConnected && !isAuthenticated && (
                                    <button
                                        onClick={signIn}
                                        disabled={isSigningIn}
                                        className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 transition-colors"
                                    >
                                        {isSigningIn ? "Signing In..." : "Sign In to Account"}
                                    </button>
                                )}
                                <div className="flex justify-center">
                                    <ConnectButton showBalance={false} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}