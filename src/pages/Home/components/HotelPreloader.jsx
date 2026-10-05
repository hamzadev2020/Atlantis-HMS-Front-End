import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export const HotelPreloader = ({ onLoaded }) => {
    const [progress, setProgress] = useState(0);
    const [subMessage, setSubMessage] = useState("Preparing your retreat...");
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const curtainTopRef = useRef(null);
    const curtainBottomRef = useRef(null);

    useEffect(() => {
        // Prevent background scrolling while preloader is active
        document.body.style.overflow = "hidden";

        const messages = [
            "Preparing your retreat...",
            "Gathering ocean light & shoreline breeze...",
            "Curating architectural suites...",
            "Welcome to Atlantis."
        ];

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 8) + 4;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setProgress(100);
                setSubMessage(messages[3]);

                // Trigger exit animation with luxury split curtain or upward glide
                setTimeout(() => {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            document.body.style.overflow = "";
                            onLoaded?.();
                        }
                    });

                    // Fade out inner content
                    tl.to(contentRef.current, {
                        opacity: 0,
                        y: -24,
                        duration: 0.6,
                        ease: "power2.in"
                    });

                    // Architectural split curtain reveal
                    tl.to(
                        curtainTopRef.current,
                        {
                            yPercent: -100,
                            duration: 1.1,
                            ease: "power4.inOut"
                        },
                        "-=0.2"
                    );

                    tl.to(
                        curtainBottomRef.current,
                        {
                            yPercent: 100,
                            duration: 1.1,
                            ease: "power4.inOut"
                        },
                        "<"
                    );

                    tl.to(
                        containerRef.current,
                        {
                            opacity: 0,
                            duration: 0.2,
                            display: "none"
                        }
                    );
                }, 350);
            } else {
                setProgress(currentProgress);
                if (currentProgress > 70) {
                    setSubMessage(messages[2]);
                } else if (currentProgress > 35) {
                    setSubMessage(messages[1]);
                }
            }
        }, 55);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = "";
        };
    }, [onLoaded]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto select-none"
            aria-label="Website loading"
            role="status"
        >
            {/* Top Half Curtain */}
            <div
                ref={curtainTopRef}
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#141815] border-b border-[#386641]/30"
            />
            {/* Bottom Half Curtain */}
            <div
                ref={curtainBottomRef}
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#141815] border-t border-[#386641]/30"
            />

            {/* Subtle background ambient grain / tone */}
            <div className="absolute inset-0 bg-[#161D17]/40 pointer-events-none" />

            {/* Central Luxury Hotel Crest & Progress */}
            <div
                ref={contentRef}
                className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-md w-full"
            >
                {/* Monogram Crest */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border border-[#A7C957]/30 flex items-center justify-center bg-[#1D251E]/60 shadow-[0_0_40px_rgba(56,102,65,0.25)] animate-pulse">
                        <span className="font-serif text-3xl text-[#F2E8CF] font-normal tracking-widest pl-1">
                            A
                        </span>
                    </div>
                    {/* Subtle outer decorative ring */}
                    <div className="absolute -inset-1.5 rounded-full border border-[#386641]/40" />
                </div>

                {/* Hotel Brand Name */}
                <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-[0.22em] uppercase">
                    Atlantis The Royal
                </h1>

                {/* Eyebrow Subtitle */}
                <div className="inline-flex items-center gap-2 mt-2">
                    <span className="w-1 h-1 rounded-full bg-[#A7C957]" />
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#A7C957] font-semibold">
                        Clifton • Karachi
                    </p>
                    <span className="w-1 h-1 rounded-full bg-[#A7C957]" />
                </div>

                {/* Hairline Progress Track */}
                <div className="w-48 sm:w-64 h-[2px] bg-white/10 mt-10 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-[#386641] via-[#6A994E] to-[#A7C957] transition-all duration-150 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Counter & Status Note */}
                <div className="mt-4 flex items-center justify-between w-48 sm:w-64 text-[11px] font-mono tracking-widest">
                    <span className="text-[#A7C957]/80 text-[10px] tracking-[0.16em] uppercase font-sans">
                        {subMessage}
                    </span>
                    <span className="text-white/80 font-serif text-sm">
                        {String(progress).padStart(2, "0")}%
                    </span>
                </div>

                {/* Editorial Quote Footnote */}
                <p className="font-serif italic text-xs text-white/40 mt-8 tracking-wider">
                    "Your place to stay."
                </p>
            </div>
        </div>
    );
};
