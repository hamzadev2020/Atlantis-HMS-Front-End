import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { getUserProfile } from "../../services/homeApi";
import { HOTEL_MEDIA } from "../../config/hotelMedia";
import { UtensilsCrossed, Waves, Wifi, Car, Sparkles, Coffee, Clock, Compass, ArrowRight } from "lucide-react";

export const AmenitiesPage = () => {
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

    const detailedFacilities = [
        {
            title: "Azure Rooftop Restaurant & Lounge",
            tag: "Gastronomy • Sunset Dining",
            description: "Perched above the Clifton coast, Azure serves fresh catch of the Arabian Sea paired with seasonal organic botanicals and artisanal wood-fired specialties.",
            hours: "Breakfast: 07:00 – 11:00 • Dinner: 18:30 – 23:30",
            features: ["Open-air ocean panorama", "Private dining booths", "Sommelier-curated pairings", "Sunset reservation priority"],
            image: "https://images.unsplash.com/photo-1761138785348-fdb2a879ec4d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Heated Saltwater Infinity Pool",
            tag: "Wellness • Horizon Leisure",
            description: "Maintained at an unhurried 28°C year-round, our heated saltwater pool mirrors the Arabian Sea horizon, flanked by linen-draped daybeds and discreet butler service.",
            hours: "Daily: 06:30 – 22:00",
            features: ["Gentle saltwater filtration", "Complimentary chilled refreshments", "Private poolside cabanas", "Adults-only morning swim hours"],
            image: HOTEL_MEDIA.EXPERIENCE_IMAGE
        },
        {
            title: "The Botanical Wellness Spa",
            tag: "Therapy • Holistic Restoration",
            description: "Rooted in ancient maritime restoration principles, treatments feature organic Himalayan salts, frankincense, and warm coastal basalt stones.",
            hours: "Daily: 09:00 – 21:00",
            features: ["Private hydrotherapy suites", "Herbal steam and eucalyptus sauna", "Single & couples treatment pavilions", "Custom aromatherapy blending"],
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
        },
        {
            title: "Executive Chauffeur & Private Fleet",
            tag: "Mobility • Seamless Transfers",
            description: "Our dedicated fleet of Mercedes-Benz sedans ensures frictionless transit between Jinnah International Airport, Karachi's financial district, and cultural landmarks.",
            hours: "24/7 on demand",
            features: ["Airport meet & greet with luggage escort", "Complimentary Wi-Fi and chilled water in-transit", "Bespoke city tour itineraries", "Complimentary resident valet"],
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
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
                            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop"
                            alt="Amenities Header"
                            className="w-full h-full object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/70" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                Curated Hotel Amenities • Clifton
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            Elevated Conveniences
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Every facility at Atlantis is curated to give you time back—whether indulging in coastal dining, floating in heated saltwater, or working in uninterrupted quiet.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* Detailed Facilities List */}
                <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10 space-y-20">
                    {detailedFacilities.map((facility, idx) => (
                        <div
                            key={idx}
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                            }`}
                        >
                            <div className={`lg:col-span-6 overflow-hidden bg-neutral-200 aspect-[16/11] ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                                <img
                                    src={facility.image}
                                    alt={facility.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            <div className={`lg:col-span-6 space-y-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                                    {facility.tag}
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-snug">
                                    {facility.title}
                                </h2>
                                <p className="text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
                                    {facility.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white/80 border border-neutral-300 p-3">
                                    <Clock size={15} className="text-[#386641] shrink-0" />
                                    <span>{facility.hours}</span>
                                </div>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                    {facility.features.map((feat, i) => (
                                        <li key={i} className="text-xs text-neutral-600 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#6A994E]" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4">
                                    <button
                                        onClick={() => navigate("/suites")}
                                        className="bg-[#386641] hover:bg-[#284a30] text-white text-xs uppercase tracking-[0.16em] font-semibold px-6 py-3 transition-colors flex items-center gap-2"
                                    >
                                        Experience Atlantis
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
