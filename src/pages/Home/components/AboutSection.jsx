import React, { useEffect, useRef, useState } from "react";
import { HOTEL_MEDIA, HOTEL_STATS } from "../../../config/hotelMedia";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AboutSection = () => {
    const [animated, setAnimated] = useState(false);
    const sectionRef = useRef(null);
    const img1Ref = useRef(null);
    const img2Ref = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimated(true);
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(el);

        // GSAP ScrollTrigger photographic parallax
        if (typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const ctx = gsap.context(() => {
                if (img1Ref.current) {
                    gsap.fromTo(
                        img1Ref.current,
                        { yPercent: -5, scale: 1.05 },
                        {
                            yPercent: 5,
                            scale: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.2
                            }
                        }
                    );
                }

                if (img2Ref.current) {
                    gsap.fromTo(
                        img2Ref.current,
                        { yPercent: 8, scale: 1.05 },
                        {
                            yPercent: -8,
                            scale: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.4
                            }
                        }
                    );
                }
            }, sectionRef);

            return () => {
                observer.disconnect();
                ctx.revert();
            };
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="py-24 lg:py-36 bg-[#F2E8CF] text-neutral-900 overflow-hidden relative"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Editorial Header */}
                <div className="max-w-3xl mb-16 lg:mb-20">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                        Our Philosophy • Clifton Shoreline
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-neutral-900 mt-4 leading-[1.12]">
                        Built for Karachi's coastline, <br className="hidden sm:inline" />
                        <span className="italic font-normal">not against it.</span>
                    </h2>
                </div>

                {/* Editorial Split: Story Copy & Architectural Images */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Story Paragraphs */}
                    <div className="lg:col-span-6 space-y-6 text-neutral-700 leading-relaxed text-base sm:text-lg font-light">
                        <p>
                            Atlantis sits a gentle walk from Clifton's shoreline, positioned intentionally to capture morning sea mist and evening maritime breezes. Every corridor, salon, and suite is arranged around natural coastal illumination rather than an insular urban plan.
                        </p>
                        <p>
                            Whether visiting Karachi for an unhurried weekend, high-level business affairs, or an extended coastal retreat, our hospitality ethos focuses on what truly matters: quiet discretion, honest natural materials, and an effortless arrival.
                        </p>
                        <p>
                            From the warm travertine in our lobby to the hand-finished linens in your room, we invite you to slow your tempo and rediscover the timeless elegance of seaside living.
                        </p>

                        <div className="pt-4 flex items-center gap-6">
                            <div>
                                <span className="font-serif text-2xl text-[#386641] block">Abdul Rehman</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Managing Director</span>
                            </div>
                            <div className="h-8 w-px bg-neutral-300" />
                            <p className="text-xs text-neutral-600 italic max-w-xs">
                                "A calm sanctuary where architecture and genuine human warmth meet."
                            </p>
                        </div>
                    </div>

                    {/* Dual Architectural Image Composition with Parallax */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-7 overflow-hidden bg-neutral-200">
                            <img
                                ref={img1Ref}
                                src={HOTEL_MEDIA.ABOUT_STORY}
                                alt="Atlantis Hotel interior architectural light"
                                className="w-full h-[400px] sm:h-[460px] object-cover transition-transform duration-700"
                                loading="lazy"
                            />
                        </div>
                        <div className="sm:col-span-5 overflow-hidden bg-neutral-200 sm:-mt-12 shadow-xl shadow-black/10">
                            <img
                                ref={img2Ref}
                                src={HOTEL_MEDIA.ABOUT_DETAIL}
                                alt="Minimalist hotel craftsmanship"
                                className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-700"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Animated Stats Band */}
                <div className="mt-20 pt-16 border-t border-[#DFD4B7] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {HOTEL_STATS.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#386641] tracking-tight">
                                {stat.value}
                                <span className="text-2xl lg:text-3xl text-[#6A994E] ml-0.5">{stat.suffix}</span>
                            </div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-900 mt-2">
                                {stat.label}
                            </h3>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
