import React, { useEffect, useRef } from "react";
import { HOTEL_MEDIA } from "../../../config/hotelMedia";
import { ArrowRight, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CtaSection = ({ onBookClick }) => {
    const sectionRef = useRef(null);
    const bgImageRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const sectionEl = sectionRef.current;
        const bgEl = bgImageRef.current;
        if (!sectionEl || !bgEl) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                bgEl,
                { yPercent: -10, scale: 1.1 },
                {
                    yPercent: 10,
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[620px] flex items-center overflow-hidden bg-[#161A17] text-white"
        >
            {/* Background Image with Parallax & Dark Green Overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    ref={bgImageRef}
                    src={HOTEL_MEDIA.CLOSING_IMAGE}
                    alt="Atlantis hotel coastal grounds at evening dusk"
                    className="w-full h-full object-cover will-change-transform"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-[#162319]/75 backdrop-brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
                <div className="max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#A7C957] font-semibold">
                        Reservations & Inquiries • Clifton, Karachi
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mt-4 leading-[1.08]">
                        Stay a little longer.
                    </h2>
                    <p className="font-serif text-2xl text-[#F2E8CF] mt-4 italic font-normal">
                        Your peaceful shoreline room awaits.
                    </p>
                    <p className="mt-5 text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-lg">
                        Choose your preferred dates and allow our hospitality team to curate every detail of your stay in Karachi.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                            onClick={onBookClick}
                            className="bg-[#F2E8CF] hover:bg-white text-[#161A17] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2 shadow-lg"
                        >
                            Reserve Your Stay
                            <ArrowRight size={14} />
                        </button>
                        <a
                            href="tel:+922135830000"
                            className="border border-white/60 hover:border-white text-white hover:bg-white hover:text-[#161A17] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2"
                        >
                            <Phone size={14} />
                            +92 21 3583 0000
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
