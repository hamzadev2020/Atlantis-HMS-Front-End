import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { getUserProfile } from "../../services/homeApi";
import { HOTEL_MEDIA } from "../../config/hotelMedia";
import { X, Eye, Maximize2, Sparkles, Filter } from "lucide-react";

export const GalleryPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const [authModal, setAuthModal] = useState({ isOpen: false, context: "booking" });

    const [activeCategory, setActiveCategory] = useState("All");
    const [lightboxImage, setLightboxImage] = useState(null);

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

    const expandedGallery = [
        ...HOTEL_MEDIA.GALLERY,
        {
            id: 7,
            category: "Dining",
            title: "Private Courtyard Breakfast",
            subtitle: "Morning shade under native olive trees",
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/11]"
        },
        {
            id: 8,
            category: "Atmosphere",
            title: "Clifton Shoreline Dusk",
            subtitle: "Evening tide receding along Karachi coast",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/11]"
        },
        {
            id: 9,
            category: "Architecture",
            title: "Travertine Spiral Stairwell",
            subtitle: "Hand-honed limestone masonry",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-4 lg:col-span-4 aspect-[4/5]"
        },
        {
            id: 10,
            category: "Wellness",
            title: "Botanical Aromatherapy Pavilion",
            subtitle: "Organic oils and natural clay",
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-8 lg:col-span-8 aspect-[16/10]"
        }
    ];

    const categories = ["All", "Suites", "Atmosphere", "Dining", "Wellness", "Architecture"];

    const filtered = expandedGallery.filter((item) =>
        activeCategory === "All" ? true : item.category === activeCategory
    );

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
                            src={HOTEL_MEDIA.GALLERY[0].image}
                            alt="Gallery Hero"
                            className="w-full h-full object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/70" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                Architectural Portfolio • Visual Journal
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            The Visual Journal
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            A photographic exhibition of spaces, quiet corners, and natural sea illumination across Atlantis The Royal.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* Filter and Photo Masonry */}
                <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300 pb-6 mb-12">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-800">
                            <Filter size={15} className="text-[#386641]" />
                            <span>Filter Curations:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all ${
                                        activeCategory === cat
                                            ? "bg-[#386641] text-white shadow-sm"
                                            : "bg-white/80 text-neutral-700 hover:bg-white hover:text-neutral-900 border border-neutral-300/70"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Masonry Grid */}
                    <div className="grid grid-cols-12 gap-4 lg:gap-6">
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setLightboxImage(item)}
                                className={`group relative overflow-hidden bg-neutral-200 cursor-pointer ${item.span}`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-8 text-white">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7C957] font-semibold">
                                        {item.category}
                                    </span>
                                    <h3 className="font-serif text-2xl text-[#F2E8CF] mt-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-white/80 font-light mt-1 flex items-center justify-between">
                                        <span>{item.subtitle}</span>
                                        <Maximize2 size={16} className="text-[#A7C957]" />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-5xl w-full bg-[#161A17] text-white border border-white/20 p-4 sm:p-6"
                    >
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white"
                            aria-label="Close lightbox"
                        >
                            <X size={24} />
                        </button>

                        <div className="aspect-[16/10] overflow-hidden bg-black mb-4">
                            <img
                                src={lightboxImage.image}
                                alt={lightboxImage.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7C957]">
                                    {lightboxImage.category}
                                </span>
                                <h4 className="font-serif text-2xl text-[#F2E8CF] mt-0.5">
                                    {lightboxImage.title}
                                </h4>
                            </div>
                            <p className="text-xs text-neutral-400 font-light italic">
                                {lightboxImage.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <AuthPromptModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, context: "booking" })}
                context={authModal.context}
            />
        </div>
    );
};
