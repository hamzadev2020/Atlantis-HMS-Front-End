import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield, Compass, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const footerRef = useRef(null);
    const contentRef = useRef(null);
    const watermarkRef = useRef(null);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.includes("@")) {
            setSubscribed(true);
            setEmail("");
        }
    };

    useEffect(() => {
        if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const footerEl = footerRef.current;
        const watermarkEl = watermarkRef.current;
        const contentEl = contentRef.current;
        if (!footerEl) return;

        const ctx = gsap.context(() => {
            // Subtle upward content parallax reveal
            if (contentEl) {
                gsap.fromTo(
                    contentEl,
                    { y: 40, opacity: 0.85 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: footerEl,
                            start: "top bottom",
                            end: "bottom bottom",
                            scrub: 1.2
                        }
                    }
                );
            }

            // Giant architectural watermark parallax scrub across bottom
            if (watermarkEl) {
                gsap.fromTo(
                    watermarkEl,
                    { xPercent: 5 },
                    {
                        xPercent: -8,
                        ease: "none",
                        scrollTrigger: {
                            trigger: footerEl,
                            start: "top bottom",
                            end: "bottom bottom",
                            scrub: 1.5
                        }
                    }
                );
            }
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative bg-[#131714] text-[#FAF7EF]/80 pt-24 pb-12 border-t border-white/10 overflow-hidden"
        >
            {/* Ambient subtle forest gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#386641]/10 blur-[100px] pointer-events-none" />

            <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                {/* Top architectural tagline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-12 mb-12 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#A7C957]" />
                        <span className="text-[11px] uppercase tracking-[0.25em] text-[#A7C957] font-semibold">
                            Coastal Hospitality • Clifton, Karachi
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light italic">
                        "Designed for quietness, cross-sea breezes, and memorable human stays."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#386641] text-[#F2E8CF] font-serif text-xl flex items-center justify-center border border-[#A7C957]/30">
                                    A
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif text-2xl text-white tracking-wider uppercase leading-none">
                                        Atlantis
                                    </span>
                                    <span className="text-[9px] uppercase tracking-[0.28em] text-[#A7C957] font-medium mt-1">
                                        The Royal • Karachi
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
                                A coastal retreat situated in Block 4, Clifton. Crafted for residents and travelers who value architectural light, serene sea views, and discreet service.
                            </p>
                        </div>

                        <div className="mt-8 text-xs text-neutral-400 space-y-1.5">
                            <p className="text-white/90 font-medium">Block 4, Clifton Marine Drive, Karachi</p>
                            <p className="text-neutral-400">Concierge Desk: +92 21 3583 0000</p>
                            <p className="text-[#A7C957] font-medium">stay@atlantishotel.pk</p>
                        </div>
                    </div>

                    {/* Suite Collections */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-5">
                            Accommodations
                        </h4>
                        <ul className="space-y-3 text-xs tracking-wider">
                            <li><a href="#rooms" className="hover:text-white transition-colors">Deluxe Ocean Rooms</a></li>
                            <li><a href="#rooms" className="hover:text-white transition-colors">Executive Suites</a></li>
                            <li><a href="#rooms" className="hover:text-white transition-colors">Presidential Horizon</a></li>
                            <li><a href="#rooms" className="hover:text-white transition-colors">Private Terraces</a></li>
                            <li><a href="#rooms" className="hover:text-white transition-colors">Seasonal Packages</a></li>
                        </ul>
                    </div>

                    {/* Property Experience */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-5">
                            Hotel & Living
                        </h4>
                        <ul className="space-y-3 text-xs tracking-wider">
                            <li><a href="#about" className="hover:text-white transition-colors">Architectural Story</a></li>
                            <li><a href="#facilities" className="hover:text-white transition-colors">Rooftop Restaurant</a></li>
                            <li><a href="#facilities" className="hover:text-white transition-colors">Saltwater Infinity Pool</a></li>
                            <li><a href="#facilities" className="hover:text-white transition-colors">Wellness Pavilion</a></li>
                            <li><a href="#reviews" className="hover:text-white transition-colors">Guest Reviews</a></li>
                        </ul>
                    </div>

                    {/* Newsletter / Dispatch */}
                    <div className="lg:col-span-4">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-3">
                            The Coastal Dispatch
                        </h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
                            Receive quiet seasonal invitations, cultural events along Clifton, and private retreat offerings.
                        </p>

                        {subscribed ? (
                            <div className="bg-[#386641]/20 border border-[#6A994E]/60 p-3.5 text-xs text-[#A7C957] flex items-center gap-2">
                                <Check size={14} />
                                Thank you. You are enrolled on our private dispatch list.
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex items-center gap-0">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="bg-white/10 border border-white/20 px-4 py-3 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#A7C957] flex-1"
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe to newsletter"
                                    className="bg-[#386641] hover:bg-[#2c5133] text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Giant Architectural Watermark Parallax */}
                <div className="overflow-hidden py-10 select-none pointer-events-none opacity-40">
                    <div
                        ref={watermarkRef}
                        className="font-serif text-[11vw] leading-none text-white/[0.07] whitespace-nowrap tracking-[0.06em] font-light"
                    >
                        ATLANTIS THE ROYAL • CLIFTON
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 border-t border-white/5">
                    <p>© {new Date().getFullYear()} Atlantis The Royal Hotel, Karachi. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/guest-privacy-policy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                        <a href="#about" className="hover:text-neutral-300 transition-colors">Terms of Stay</a>
                        <a href="#faq" className="hover:text-neutral-300 transition-colors">FAQ</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
