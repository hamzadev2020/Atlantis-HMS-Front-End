import React, { useState } from "react";
import { X, Users, Bed, Check, ArrowRight, ShieldCheck } from "lucide-react";

export const RoomDetailModal = ({ room, isOpen, onClose, onBookRoom }) => {
    if (!isOpen || !room) return null;

    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const images = Array.isArray(room.images) && room.images.length > 0 ? room.images : [room.image];
    const isAvailable = room.status === "available";

    const formatPrice = (val) => {
        const num = Number(val) || 0;
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-[#FAF7EF] text-neutral-900 border border-[#DFD4B7] shadow-2xl overflow-hidden rounded-xs max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                    aria-label="Close details"
                >
                    <X size={18} />
                </button>

                <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
                    {/* Active Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                        <img
                            src={images[activeImageIdx] || room.image}
                            alt={room.roomType}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-semibold">
                            {room.roomType}
                        </div>
                    </div>

                    {/* Image Thumbnails if multiple */}
                    {images.length > 1 && (
                        <div className="flex gap-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`w-16 h-12 overflow-hidden border-2 transition-all ${
                                        activeImageIdx === idx ? "border-[#386641] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Room Titles and Capacity */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-300 pb-5">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                                Architectural Suite Portfolio
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
                                Suite {room.roomNumber} — {room.roomType}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700 bg-white/80 border border-neutral-300 px-3.5 py-1.5 self-start">
                            <Users size={16} className="text-[#386641]" />
                            <span>Up to {room.capacity} Guests</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                            Space & Atmosphere
                        </h4>
                        <p className="text-sm text-neutral-700 leading-relaxed font-light">
                            {room.description}
                        </p>
                    </div>

                    {/* Amenities Included */}
                    {room.amenities && (
                        <div>
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-800 mb-3">
                                Included In Suite
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {room.amenities.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-700 bg-white/70 border border-neutral-200 p-2">
                                        <Check size={14} className="text-[#386641] shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Booking Footer */}
                    <div className="pt-6 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                                Nightly Rate
                            </span>
                            <div className="font-serif text-3xl text-[#386641] font-semibold">
                                {formatPrice(room.pricePerNight)}
                                <span className="text-xs font-sans font-normal text-neutral-500 ml-1">/ night</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={onClose}
                                className="w-1/2 sm:w-auto px-5 py-3 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider hover:bg-neutral-100"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    onBookRoom(room);
                                }}
                                disabled={!isAvailable}
                                className="w-1/2 sm:w-auto bg-[#386641] hover:bg-[#284a30] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs uppercase tracking-[0.16em] font-semibold px-7 py-3 transition-colors flex items-center justify-center gap-2"
                            >
                                {isAvailable ? "Reserve This Suite" : "Currently Unavailable"}
                                {isAvailable && <ArrowRight size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
