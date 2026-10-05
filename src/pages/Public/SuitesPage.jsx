import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { RoomDetailModal } from "../Home/components/RoomDetailModal";
import { getRooms, getUserProfile } from "../../services/homeApi";
import { HOTEL_MEDIA } from "../../config/hotelMedia";
import { Users, Bed, Check, ArrowRight, Eye, ShieldCheck, Sparkles, Filter } from "lucide-react";

export const SuitesPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [authModal, setAuthModal] = useState({ isOpen: false, context: "booking" });
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (token) {
            getUserProfile().then(setUser);
        }
        getRooms()
            .then(setRooms)
            .finally(() => setLoading(false));
    }, [token]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    const handleBookRoom = (room) => {
        if (token && role === "guest") {
            navigate(`/booking/${room._id}`);
        } else {
            setAuthModal({ isOpen: true, context: "booking" });
        }
    };

    const filteredRooms = rooms.filter((r) => {
        if (filter === "all") return true;
        const type = (r.roomType || "").toLowerCase();
        if (filter === "deluxe") return type.includes("deluxe") || type.includes("standard");
        if (filter === "executive") return type.includes("executive");
        if (filter === "suite") return type.includes("suite") || type.includes("presidential");
        return true;
    });

    const formatPrice = (val) => {
        const num = Number(val) || 0;
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="min-h-screen bg-[#F2E8CF] text-neutral-900 selection:bg-[#386641] selection:text-[#F2E8CF]">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onOpenAuthPrompt={() => setAuthModal({ isOpen: true, context: "booking" })}
            />

            <main className="relative z-10 bg-[#F2E8CF] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)]">
                {/* Hero Header */}
                <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-28 bg-[#161A17] text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={HOTEL_MEDIA.ROOM_SUITE}
                            alt="Suites Showcase Background"
                            className="w-full h-full object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/60" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                Architectural Portfolio • Clifton Shoreline
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            Suites & Private Quarters
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Each of our 42 spaces is oriented toward the Arabian Sea, pairing expansive natural light with tactile travertine, hand-loomed linens, and acoustic stillness.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* Filter and Suites Grid */}
                <section className="py-20 lg:py-28 max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300 pb-6 mb-12">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-neutral-800">
                            <Filter size={15} className="text-[#386641]" />
                            <span>Select Suite Class:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "all", label: "All Portfolio" },
                                { id: "deluxe", label: "Deluxe Ocean Rooms" },
                                { id: "executive", label: "Executive Salons" },
                                { id: "suite", label: "Horizon & Penthouse Suites" }
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => setFilter(btn.id)}
                                    className={`px-5 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all ${
                                        filter === btn.id
                                            ? "bg-[#386641] text-white shadow-sm"
                                            : "bg-white/80 text-neutral-700 hover:bg-white hover:text-neutral-900 border border-neutral-300/70"
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="animate-pulse bg-neutral-200 aspect-[4/5]" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {filteredRooms.map((room) => (
                                <article
                                    key={room._id}
                                    className="group flex flex-col bg-[#FAF7EF] border border-[#E0D5BE] overflow-hidden transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className="relative aspect-[16/11] overflow-hidden bg-neutral-200">
                                        <img
                                            src={room.image}
                                            alt={room.roomType}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs text-[#F2E8CF] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1">
                                            {room.roomType}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-baseline justify-between">
                                                <h3 className="font-serif text-2xl text-neutral-900">
                                                    Suite {room.roomNumber}
                                                </h3>
                                                <span className="flex items-center gap-1 text-xs text-neutral-600">
                                                    <Users size={14} className="text-[#386641]" />
                                                    Up to {room.capacity}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed line-clamp-3">
                                                {room.description}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {room.amenities?.map((amenity, i) => (
                                                    <span key={i} className="text-[10px] bg-white border border-neutral-300 px-2 py-0.5 text-neutral-700">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-5 border-t border-neutral-300 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Nightly rate</span>
                                                <div className="font-serif text-xl sm:text-2xl text-[#386641] font-semibold">
                                                    {formatPrice(room.pricePerNight)}
                                                    <span className="text-xs font-sans font-normal text-neutral-500"> / night</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRoom(room)}
                                                    className="p-2.5 text-neutral-700 hover:text-[#386641] hover:bg-neutral-200/50"
                                                    title="View Suite Details"
                                                >
                                                    <Eye size={17} />
                                                </button>
                                                <button
                                                    onClick={() => handleBookRoom(room)}
                                                    className="bg-[#386641] hover:bg-[#284a30] text-white text-[11px] uppercase tracking-[0.16em] font-semibold px-4 py-2.5 flex items-center gap-1.5"
                                                >
                                                    Reserve
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Suite Inclusions Overview */}
                    <div className="mt-24 p-8 sm:p-12 bg-white border border-[#DFD4B7]">
                        <div className="max-w-2xl mb-8">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                                Included With Every Stay
                            </span>
                            <h3 className="font-serif text-3xl text-neutral-900 mt-2">
                                Uncompromising Hospitality Standards
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Artisanal Breakfast", desc: "Fresh sourdough, coastal fruits, and single-origin coffee served daily in-suite or on the rooftop." },
                                { title: "Heated Saltwater Access", desc: "Full access to our private 28°C oceanfront infinity pool and shaded cabana daybeds." },
                                { title: "Valet & Arrival Concierge", desc: "Luggage unpacking, garment pressing upon arrival, and seamless vehicle valet." },
                                { title: "High-Speed Fiber Network", desc: "Dedicated gigabit Wi-Fi suitable for video production, private meetings, and streaming." }
                            ].map((item, idx) => (
                                <div key={idx} className="border-l-2 border-[#386641] pl-4">
                                    <h4 className="font-semibold text-sm text-neutral-900 uppercase tracking-wider">{item.title}</h4>
                                    <p className="mt-1.5 text-xs text-neutral-600 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
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

            <RoomDetailModal
                room={selectedRoom}
                isOpen={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onBookRoom={handleBookRoom}
            />
        </div>
    );
};
