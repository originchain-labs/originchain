"use client";

import { useEffect, useState } from "react";

const STEPS = [
    { id: "step-01", label: "01 Create" },
    { id: "step-02", label: "02 Register" },
    { id: "step-03", label: "03 Prove" },
    { id: "step-04", label: "04 Record" },
    { id: "step-05", label: "05 Validate" },
    { id: "step-06", label: "06 Protect" },
    { id: "step-07", label: "07 Verify" },
];

export function StickyStepNav() {
    const [activeId, setActiveId] = useState("step-01");

    useEffect(() => {
        const handleScroll = () => {
            for (const step of STEPS) {
                const el = document.getElementById(step.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        setActiveId(step.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToStep = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="sticky top-20 z-40 py-3 bg-[#030712]/90 border-y border-cyan-500/20 backdrop-blur-xl shadow-xl">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
                {STEPS.map((step) => {
                    const isActive = activeId === step.id;
                    return (
                        <button
                            key={step.id}
                            onClick={() => scrollToStep(step.id)}
                            className={`px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                                isActive
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {step.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
