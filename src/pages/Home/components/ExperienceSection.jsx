import React, { useRef, useEffect } from "react";
import { HOTEL_MEDIA } from "../../../config/hotelMedia";
import { ArrowRight, Compass } from "lucide-react";

export const ExperienceSection = ({ onExplore }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !HOTEL_MEDIA.EXPERIENCE_VIDEO) return;

        // Auto pause when scrolled away to preserve CPU and battery
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoEl.play().catch(() => {});
                } else {
                    videoEl.pause();
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(videoEl);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="experience" className="grid grid-cols-1 lg:grid-cols-2 bg-[#386641] text-[#F2E8CF] overflow-hidden">
            {/* Left Media Moment: Cinematic Video or Photography */}
            <div className="relative min-h-[460px] lg:min-h-[720px] overflow-hidden bg-neutral-900">
                {HOTEL_MEDIA.EXPERIENCE_VIDEO ? (
                    <video
                        ref={videoRef}
                        src={HOTEL_MEDIA.EXPERIENCE_VIDEO}
                        poster={HOTEL_MEDIA.EXPERIENCE_IMAGE}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-1000 scale-100"
                    />
                ) : (
                    /* -------------------------------------------------------------
                       REPLACE HERE: To use a second hotel campaign video, set
                       EXPERIENCE_VIDEO in src/config/hotelMedia.js
                       ------------------------------------------------------------- */
                    <img
                        src={HOTEL_MEDIA.EXPERIENCE_IMAGE}
                        alt="The hotel poolside experience at dusk"
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        loading="lazy"
                    />
                )}
                {/* Subtle dark green sheen */}
                <div className="absolute inset-0 bg-[#162319]/25 pointer-events-none" />
            </div>

            {/* Right Editorial Campaign Text */}
            <div className="flex items-center px-8 sm:px-12 lg:px-20 py-20 lg:py-28">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Compass size={14} className="text-[#A7C957]" />
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#A7C957] font-semibold">
                            The Experience • Karachi Coastal Living
                        </p>
                    </div>

                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08]">
                        More than a room.
                    </h2>

                    <p className="font-serif text-2xl sm:text-3xl text-[#F2E8CF] mt-6 leading-snug font-normal italic">
                        "Stay somewhere that gives you a reason to slow down."
                    </p>

                    <p className="mt-6 text-sm sm:text-base text-white/80 font-light leading-relaxed">
                        From a quiet sunrise coffee on your ocean balcony to an unhurried dip in our heated saltwater pool, every hour at Atlantis is crafted to remind you of the pleasure of being present. We invite you to experience Karachi's coast in peaceful tranquility.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <button
                            onClick={onExplore}
                            className="bg-[#F2E8CF] hover:bg-white text-[#161A17] text-xs uppercase tracking-[0.18em] font-semibold px-8 py-3.5 transition-all duration-300 flex items-center gap-2 shadow-md"
                        >
                            Discover The Experience
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
