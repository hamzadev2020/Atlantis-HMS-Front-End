import React, { useState } from "react";
import { Users, Bed, ArrowRight, Eye, Check } from "lucide-react";

export const FeaturedRoomsSection = ({
    rooms,
    loading,
    error,
    onBookRoom,
    onViewRoomDetails,
    onRetry
}) => {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = [
        { id: "all", label: "All Accommodations" },
        { id: "deluxe", label: "Deluxe Rooms" },
        { id: "executive", label: "Executive Suites" },
        { id: "suite", label: "Horizon & Presidential" }
    ];

    const filteredRooms = rooms.filter((room) => {
        if (selectedCategory === "all") return true;
        const type = (room.roomType || "").toLowerCase();
        if (selectedCategory === "deluxe") return type.includes("deluxe") || type.includes("standard");
        if (selectedCategory === "executive") return type.includes("executive");
        if (selectedCategory === "suite") return type.includes("suite") || type.includes("presidential");
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
        <section id="rooms" className="py-24 lg:py-36 bg-white text-neutral-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                            Accommodations • Unhurried Living
                        </p>
                        <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-3 leading-tight">
                            Rooms & Private Suites
                        </h2>
                    </div>
                    <p className="text-sm text-neutral-600 max-w-md font-light leading-relaxed">
                        Every room is an ode to space, natural ocean light, and calm architectural proportions. Browse our collection and reserve your stay.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-neutral-200 pb-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 ${
                                selectedCategory === cat.id
                                    ? "bg-[#386641] text-white shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Loading Skeleton State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="animate-pulse flex flex-col">
                                <div className="aspect-[4/3] bg-neutral-200 w-full" />
                                <div className="mt-5 h-6 bg-neutral-200 w-2/3" />
                                <div className="mt-3 h-4 bg-neutral-200 w-full" />
                                <div className="mt-2 h-4 bg-neutral-200 w-4/5" />
                                <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-between">
                                    <div className="h-6 bg-neutral-200 w-24" />
                                    <div className="h-8 bg-neutral-200 w-28" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="bg-[#FAF7EF] border border-red-200 p-8 text-center max-w-lg mx-auto">
                        <p className="text-sm text-red-800 mb-4">{error}</p>
                        <button
                            onClick={onRetry}
                            className="bg-[#386641] text-white text-xs uppercase tracking-[0.16em] px-6 py-2.5 hover:bg-[#2c5133]"
                        >
                            Retry Loading Rooms
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredRooms.length === 0 && (
                    <div className="bg-[#FAF7EF] p-12 text-center max-w-lg mx-auto border border-neutral-200">
                        <p className="font-serif text-2xl text-neutral-800">No rooms currently available in this category.</p>
                        <p className="text-xs text-neutral-600 mt-2">
                            Please select another room class or contact our concierge for bespoke accommodations.
                        </p>
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className="mt-6 border border-[#386641] text-[#386641] text-xs uppercase tracking-[0.16em] px-6 py-2 hover:bg-[#386641] hover:text-white transition-colors"
                        >
                            Show All Suites
                        </button>
                    </div>
                )}

                {/* Dynamic Room Cards Grid */}
                {!loading && !error && filteredRooms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {filteredRooms.map((room) => {
                            const isAvailable = room.status === "available";
                            return (
                                <article
                                    key={room._id}
                                    className="group flex flex-col bg-[#FAF7EF] border border-[#EBE3D0] transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
                                >
                                    {/* Image with subtle hover zoom */}
                                    <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100">
                                        <img
                                            src={room.image}
                                            alt={room.roomType}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-[#F2E8CF] text-[10px] uppercase tracking-[0.2em] font-semibold px-3 py-1">
                                            {room.roomType}
                                        </div>
                                        {!isAvailable && (
                                            <div className="absolute top-4 right-4 bg-amber-900/80 text-white text-[10px] uppercase tracking-[0.16em] font-semibold px-3 py-1">
                                                Reserved
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-baseline justify-between gap-4">
                                                <h3 className="font-serif text-2xl text-neutral-900">
                                                    Suite {room.roomNumber}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                                                    <Users size={14} className="text-[#386641]" />
                                                    <span>Up to {room.capacity}</span>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-light">
                                                {room.description}
                                            </p>

                                            {/* Key Amenities */}
                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[11px] text-neutral-600 bg-white/70 border border-neutral-300/70 px-2 py-0.5 rounded-xs"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Footer: Price & Direct Actions */}
                                        <div className="mt-6 pt-5 border-t border-neutral-200/80 flex items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 block">
                                                    Starting from
                                                </span>
                                                <div className="font-serif text-xl sm:text-2xl text-[#386641] font-semibold">
                                                    {formatPrice(room.pricePerNight)}
                                                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">/ night</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onViewRoomDetails(room)}
                                                    className="p-2.5 text-neutral-700 hover:text-[#386641] hover:bg-neutral-200/50 transition-colors"
                                                    title="View details"
                                                    aria-label="View room details"
                                                >
                                                    <Eye size={17} />
                                                </button>
                                                <button
                                                    onClick={() => onBookRoom(room)}
                                                    disabled={!isAvailable}
                                                    className="bg-[#386641] hover:bg-[#27492f] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-[11px] uppercase tracking-[0.16em] font-semibold px-4 py-2.5 transition-all duration-200 flex items-center gap-1.5"
                                                >
                                                    Book Now
                                                    <ArrowRight size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};
