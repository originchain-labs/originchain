"use client";

import { motion } from "framer-motion";

interface Props {
    mousePos: { x: number; y: number };
    reducedMotion: boolean;
}

export function Blockchain3DCameraCanvas({ mousePos, reducedMotion }: Props) {
    const parallaxX = reducedMotion ? 0 : mousePos.x * 12;
    const parallaxY = reducedMotion ? 0 : mousePos.y * 12;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
            {/* Ambient Background Radial Glows */}
            <motion.div
                style={{
                    x: parallaxX,
                    y: parallaxY,
                }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-violet-600/20 to-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Global Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Subtle Edge Gradients for top navbar & bottom footer contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-transparent to-[#030712]/70 pointer-events-none" />
        </div>
    );
}
