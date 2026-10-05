import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { getUserProfile } from "../../services/homeApi";
import { HOTEL_MEDIA } from "../../config/hotelMedia";
import { Compass, Sun, Moon, Utensils, Waves, ArrowRight } from "lucide-react";

export const ExperiencePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const [authModal, setAuthModal] = useState({ isOpen: false, context: "booking" });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (token) getUserProfile().then(setUser);
    }, [token]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    const rhythm = [
        {
            time: "07:30",
            period: "Morning",
            title: "Shoreline Awakening",
            description: "Wake to the low murmur of the Arabian Sea. Enjoy single-origin pour-overs and freshly baked cardamom sourdough served on your private terrace.",
            icon: Sun,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop"
        },
        {
            time: "12:00",
            period: "Midday",
            title: "Saltwater & Sun Cabana",
            description: "A restorative dip in our 28°C heated saltwater pool, followed by chilled coconut water, cucumber spritzes, and unhurried reading under shaded linen cabanas.",
            icon: Waves,
            image: HOTEL_MEDIA.EXPERIENCE_IMAGE
        },
        {
            time: "17:45",
            period: "Golden Hour",
            title: "The Sunset Promenade",
            description: "Clifton's horizon catches fire with amber light. Gather at the Azure Rooftop for dry botanicals, seafood crudo, and panoramic coastal breezes.",
            icon: Compass,
            image: "https://images.unsplash.com/photo-1761138785348-fdb2a879ec4d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            time: "20:30",
            period: "Evening",
            title: "Quiet Starlight Dining",
            description: "An intimate dinner beneath the Karachi night sky. Fresh local red snapper, hand-ground spices, and acoustic stillness away from traffic.",
            icon: Moon,
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F2E8CF] text-neutral-900 selection:bg-[#386641] selection:text-[#F2E8CF]">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onOpenAuthPrompt={() => setAuthModal({ isOpen: true, context: "booking" })}
            />

            <main className="relative z-10 bg-[#F2E8CF] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)]">
                {/* Hero Header */}
                <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-[#161A17] text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={HOTEL_MEDIA.EXPERIENCE_IMAGE}
                            alt="The Experience"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/70" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                The Guest Journey • Clifton Karachi
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            More than a stay.
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Discover an unhurried rhythm shaped by sea breezes, artisanal dining, and the freedom to slow down without an agenda.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* The 24-Hour Rhythm of Atlantis */}
                <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="max-w-2xl mb-16">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                            A Day at Atlantis
                        </p>
                        <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-2">
                            The Coastal Rhythm
                        </h2>
                    </div>

                    <div className="space-y-16">
                        {rhythm.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                                        idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}
                                >
                                    <div className={`lg:col-span-5 overflow-hidden bg-neutral-200 aspect-[16/11] ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="font-serif text-3xl text-[#386641] font-medium">
                                                {item.time}
                                            </span>
                                            <span className="text-neutral-400">•</span>
                                            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-600">
                                                {item.period}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-3xl text-neutral-900">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm sm:text-base text-neutral-700 font-light leading-relaxed max-w-xl">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-20 p-10 bg-white border border-[#DFD4B7] text-center max-w-2xl mx-auto">
                        <h4 className="font-serif text-3xl text-neutral-900">Ready to experience Clifton?</h4>
                        <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2 max-w-md mx-auto">
                            Reserve your suite directly with our concierge team and receive complimentary morning breakfast and valet parking.
                        </p>
                        <button
                            onClick={() => navigate("/suites")}
                            className="mt-6 bg-[#386641] hover:bg-[#284a30] text-white text-xs uppercase tracking-[0.16em] font-semibold px-8 py-3.5 transition-colors"
                        >
                            Reserve Your Suite
                        </button>
                    </div>
                </section>
            </main>

            <Footer />

            <AuthPromptModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, context: "booking" })}
                context={authModal.context}
            />
        </div>
    );
};
