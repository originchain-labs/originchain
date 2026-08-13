"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Hexagon } from "lucide-react";

export function ScrollIndicator() {
    const { scrollYProgress, scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
    });

    const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            if (latest > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        });
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <>
            {/* Top Fixed Scroll Progress Line */}
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-slate-900 z-50 pointer-events-none">
                <motion.div
                    style={{ width: progressWidth }}
                    className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-400 shadow-[0_0_12px_#06b6d4]"
                />
            </div>

            {/* Bottom Hero Scroll Indicator */}
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? 16 : 0 }}
                transition={{ duration: 0.4 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2"
            >
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-xl">
                    <Hexagon className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
                    <span className="tracking-widest font-bold uppercase">SCROLL TO EXPLORE</span>
                </div>

                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="flex flex-col items-center text-cyan-400"
                >
                    <ChevronDown className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                </motion.div>
            </motion.div>
        </>
    );
}
