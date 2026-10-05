import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { getUserProfile } from "../../services/homeApi";
import { HOTEL_MEDIA } from "../../config/hotelMedia";
import { Compass, Feather, Wind, Sparkles, Building, Layers } from "lucide-react";

export const StoryPage = () => {
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

    return (
        <div className="min-h-screen bg-[#F2E8CF] text-neutral-900 selection:bg-[#386641] selection:text-[#F2E8CF]">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onOpenAuthPrompt={() => setAuthModal({ isOpen: true, context: "booking" })}
            />

            <main className="relative z-10 bg-[#F2E8CF] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)]">
                {/* Hero Story Banner */}
                <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-[#161A17] text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={HOTEL_MEDIA.ABOUT_STORY}
                            alt="Atlantis Architectural Light"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/70" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                Architectural Genesis • Clifton, Karachi
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight max-w-4xl">
                            A sanctuary between the shore and the city.
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Atlantis was conceived as a respite from the pulsating energy of Karachi—a place where architectural restraint, honest materials, and maritime breezes redefine hospitality.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* Editorial Narrative */}
                <section className="py-24 lg:py-36 max-w-5xl mx-auto px-6 lg:px-10">
                    <div className="space-y-16">
                        <div className="border-l-2 border-[#386641] pl-6 sm:pl-10">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold mb-3">
                                The Concept
                            </p>
                            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 leading-snug">
                                "We did not wish to build another glass tower. We wanted a structure that felt as though the coastal cliffs had gently shaped it."
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-neutral-700 font-light leading-relaxed text-base">
                            <p>
                                Karachi is a city of electric dynamism and deep history. When we began planning Atlantis in Clifton, our ambition was clear: to create an unhurried hotel where the ocean is not merely a distant view, but an active participant in everyday living.
                            </p>
                            <p>
                                By aligning corridors with the prevailing sea currents, each suite benefits from natural cross-ventilation. Warm travertine floors absorb the afternoon heat, while deep balconies shield residents from direct midday glare, bathing every room in calm, diffused daylight.
                            </p>
                        </div>

                        {/* Dual Photo Composition */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                            <div className="overflow-hidden bg-neutral-200">
                                <img
                                    src={HOTEL_MEDIA.ABOUT_STORY}
                                    alt="Lobby architecture"
                                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-2">
                                    Natural limestone atrium and morning sun
                                </p>
                            </div>
                            <div className="overflow-hidden bg-neutral-200">
                                <img
                                    src={HOTEL_MEDIA.ABOUT_DETAIL}
                                    alt="Interior tactile detail"
                                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <p className="text-[11px] text-neutral-500 uppercase tracking-widest mt-2">
                                    Bespoke walnut millwork and raw brass fixtures
                                </p>
                            </div>
                        </div>

                        {/* Three Pillars of Atlantis */}
                        <div className="pt-12">
                            <h3 className="font-serif text-3xl text-neutral-900 mb-8 text-center">
                                Three Principles of Our Craft
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="p-8 bg-white border border-[#DFD4B7]">
                                    <div className="w-10 h-10 rounded-full bg-[#386641]/10 text-[#386641] flex items-center justify-center mb-5">
                                        <Wind size={20} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-serif text-xl text-neutral-900 mb-2">Climatic Rhythm</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        Arranged around the Arabian Sea breeze, ensuring fresh air flows effortlessly through all spaces.
                                    </p>
                                </div>

                                <div className="p-8 bg-white border border-[#DFD4B7]">
                                    <div className="w-10 h-10 rounded-full bg-[#386641]/10 text-[#386641] flex items-center justify-center mb-5">
                                        <Layers size={20} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-serif text-xl text-neutral-900 mb-2">Tactile Honesty</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        No synthetic veneers. Every surface is authentic stone, untreated brass, linen, or solid timber.
                                    </p>
                                </div>

                                <div className="p-8 bg-white border border-[#DFD4B7]">
                                    <div className="w-10 h-10 rounded-full bg-[#386641]/10 text-[#386641] flex items-center justify-center mb-5">
                                        <Feather size={20} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-serif text-xl text-neutral-900 mb-2">Discreet Care</h4>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                                        Hospitality that is felt rather than announced. Thoughtful anticipation without intrusion.
                                    </p>
                                </div>
                            </div>
                        </div>
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
