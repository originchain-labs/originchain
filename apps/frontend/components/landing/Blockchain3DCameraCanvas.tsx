"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface Props {
    mousePos: { x: number; y: number };
    reducedMotion: boolean;
}

export function Blockchain3DCameraCanvas({ mousePos, reducedMotion }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const targetTimeRef = useRef(0);
    const currentTimeRef = useRef(0);
    const durationRef = useRef(0);
    const animFrameIdRef = useRef<number | null>(null);

    // Parallax spring motion for smooth 3D tilt & subtle depth
    const springX = useSpring(mousePos.x, { stiffness: 100, damping: 24 });
    const springY = useSpring(mousePos.y, { stiffness: 100, damping: 24 });

    useEffect(() => {
        springX.set(reducedMotion ? 0 : mousePos.x);
        springY.set(reducedMotion ? 0 : mousePos.y);
    }, [mousePos, reducedMotion, springX, springY]);

    const rotateX = useTransform(springY, [-1, 1], [3, -3]);
    const rotateY = useTransform(springX, [-1, 1], [-3, 3]);
    const translateZ = useTransform(springY, [-1, 1], [-6, 6]);

    // Continuous 1-timeline video scroll-driven scrubbing algorithm
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            durationRef.current = video.duration || 1;
            setVideoLoaded(true);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        if (video.readyState >= 1) {
            handleLoadedMetadata();
        }

        const updateTargetTime = () => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            targetTimeRef.current = progress * (durationRef.current || 1);
        };

        window.addEventListener("scroll", updateTargetTime, { passive: true });
        window.addEventListener("resize", updateTargetTime, { passive: true });
        updateTargetTime();

        // Lerp loop (0.14 factor): Ultra-responsive, zero lag, silky continuous 60fps scrubbing
        const renderLoop = () => {
            if (videoRef.current && videoRef.current.readyState >= 2 && durationRef.current > 0) {
                const diff = targetTimeRef.current - currentTimeRef.current;
                if (Math.abs(diff) > 0.0005) {
                    currentTimeRef.current += diff * 0.14;
                    try {
                        videoRef.current.currentTime = currentTimeRef.current;
                    } catch {
                        // ignore seek errors
                    }
                }
            }
            animFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        animFrameIdRef.current = requestAnimationFrame(renderLoop);

        return () => {
            if (video) {
                video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            }
            window.removeEventListener("scroll", updateTargetTime);
            window.removeEventListener("resize", updateTargetTime);
            if (animFrameIdRef.current !== null) {
                cancelAnimationFrame(animFrameIdRef.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712] [perspective:1000px]">
            {/* 3D Motion Container for Video & Controlled Ambient Lighting */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    z: translateZ,
                    scale: 1.05,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full transition-transform ease-out duration-300"
            >
                {/* Crisp & Detailed Background Video: Lowered Brightness for Crystal-Clear Text Readability */}
                <video
                    ref={videoRef}
                    src="/assets/blockchain-bg.mp4"
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        videoLoaded ? "opacity-65" : "opacity-0"
                    }`}
                    style={{
                        filter: "brightness(0.92) contrast(1.14) saturate(1.15)",
                        imageRendering: "crisp-edges",
                    }}
                />

                {/* Soft & Subtle Ambient Lighting (Controlled Glow, Preserved Colors) */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/08 to-blue-500/08 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/08 via-cyan-600/08 to-amber-500/06 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            </motion.div>

            {/* High-Tech Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293714_1px,transparent_1px),linear-gradient(to_bottom,#1f293714_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_75%,transparent_100%)] pointer-events-none" />

            {/* Controlled Atmospheric Overlay & Vignette for Maximum Foreground Text Readability */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,#030712_95%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/75 via-[#030712]/45 to-[#030712]/80 pointer-events-none" />
        </div>
    );
}



