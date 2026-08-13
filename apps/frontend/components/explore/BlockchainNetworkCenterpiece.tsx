"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, RefreshCw, Zap, Layers, Sparkles } from "lucide-react";

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    label: string;
    pulse: number;
};

export function BlockchainNetworkCenterpiece() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [activeStats, setActiveStats] = useState({
        blocksMined: 489102,
        tps: 42,
        activeNodes: 128,
        proofLatency: "1.2s",
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const width = canvas.parentElement?.clientWidth || 800;
        const height = 450;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const labels = ["GENESIS #01", "ORIGIN HASH", "PROOF ENGINE", "ARBITRUM LOG", "IPFS PIN", "CREATOR VAULT", "VERIFIER NODE", "REPUTATION MATRIX"];
        
        const nodes: Node[] = labels.map((label, i) => {
            const angle = (i / labels.length) * Math.PI * 2;
            const dist = 140 + Math.random() * 40;
            return {
                x: width / 2 + Math.cos(angle) * dist,
                y: height / 2 + Math.sin(angle) * dist * 0.7,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: 6 + Math.random() * 4,
                label,
                pulse: Math.random() * Math.PI * 2,
            };
        });

        // Add Center Hub Node
        const hubNode: Node = {
            x: width / 2,
            y: height / 2,
            vx: 0,
            vy: 0,
            radius: 12,
            label: "ORIGINCHAIN HUB",
            pulse: 0,
        };

        const render = () => {
            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);

            // Update Hub & Nodes
            nodes.forEach((node) => {
                node.x += node.vx;
                node.y += node.vy;
                node.pulse += 0.03;

                // Bounce off boundaries
                if (node.x < 40 || node.x > width - 40) node.vx *= -1;
                if (node.y < 40 || node.y > height - 40) node.vy *= -1;

                // Draw Connecting Lines to Hub & Neighbors
                ctx.beginPath();
                ctx.moveTo(hubNode.x, hubNode.y);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Moving Pulse Particle on Line
                const progress = (Math.sin(node.pulse) + 1) / 2;
                const px = hubNode.x + (node.x - hubNode.x) * progress;
                const py = hubNode.y + (node.y - hubNode.y) * progress;

                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#22d3ee";
                ctx.shadowColor = "#06b6d4";
                ctx.shadowBlur = 10;
                ctx.fill();

                // Draw Node Circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#030712";
                ctx.strokeStyle = "#38bdf8";
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();

                // Draw Node Label
                ctx.font = "10px monospace";
                ctx.fillStyle = "#94a3b8";
                ctx.fillText(node.label, node.x - 30, node.y + 20);
            });

            // Draw Central Hub Node
            ctx.beginPath();
            ctx.arc(hubNode.x, hubNode.y, hubNode.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#06b6d4";
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 20;
            ctx.fill();

            ctx.font = "bold 11px monospace";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(hubNode.label, hubNode.x - 45, hubNode.y - 18);

            ctx.restore();
            animId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <section className="py-24 relative bg-transparent overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono"
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>LIVE DECENTRALIZED PROTOCOL MESH</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                        Interactive <span className="text-gradient-cyan">Blockchain Centerpiece.</span>
                    </h2>

                    <p className="text-base text-zinc-300">
                        Real-time visualization of atomic proof state synchronization across Arbitrum Sepolia validation nodes.
                    </p>
                </div>

                {/* Canvas Showcase Container */}
                <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 shadow-2xl shadow-cyan-950/60 p-4 sm:p-8 backdrop-blur-xl">
                    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden flex items-center justify-center">
                        <canvas ref={canvasRef} className="w-full h-full block" />

                        {/* Floating Live Network Stats Badges */}
                        <div className="absolute top-6 left-6 grid grid-cols-2 gap-3 text-xs font-mono">
                            <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 border border-cyan-500/30 text-cyan-300 flex items-center gap-2 shadow-lg">
                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                <span>TPS: 42.4 req/s</span>
                            </div>
                            <div className="px-3.5 py-2 rounded-xl bg-slate-950/85 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 shadow-lg">
                                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                                <span>LATENCY: 1.2s</span>
                            </div>
                        </div>

                        <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-slate-950/85 border border-violet-500/30 text-violet-300 text-xs font-mono flex items-center gap-2 shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            <span>128 ACTIVE VALIDATOR NODES</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
