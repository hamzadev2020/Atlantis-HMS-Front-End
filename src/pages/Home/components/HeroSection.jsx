import React, { useRef, useEffect } from "react";
import { HOTEL_MEDIA } from "../../../config/hotelMedia";
import { ArrowDown, Search, Calendar, Users, Sparkles } from "lucide-react";

export const HeroSection = ({
    bookingParams,
    setBookingParams,
    onSearchAvailability,
    onExploreRooms
}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (HOTEL_MEDIA.HERO_VIDEO && videoRef.current) {
            videoRef.current.play().catch(() => {
            });
        }
    }, []);

    return (
        <section className="relative min-h-[96vh] flex items-end overflow-hidden bg-[#161A17]">
            <div className="absolute inset-0 z-0">
                {HOTEL_MEDIA.HERO_VIDEO ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={HOTEL_MEDIA.HERO_VIDEO}
                        poster={HOTEL_MEDIA.HERO_IMAGE}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    />
                ) : (
                    <img
                        src={HOTEL_MEDIA.HERO_IMAGE}
                        alt="Atlantis Hotel Clifton shoreline at golden hour"
                        className="w-full h-full object-cover transition-transform duration-[2000ms] scale-100"
                        loading="eager"
                    />
                )}

                <div
                    className="absolute inset-0 bg-[#162319]/55 backdrop-brightness-[0.88]"
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-black/40"
                    aria-hidden="true"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20 pt-36">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                        <p className="text-[10.5px] uppercase tracking-[0.26em] text-[#F2E8CF] font-semibold">
                            Atlantics • World Trust
                        </p>
                    </div>

                    {/* Large elegant serif heading */}
                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] text-white leading-[1.04] tracking-tight">
                        Your place <br />
                        <span className="italic font-light text-[#F2E8CF]">to stay.</span>
                    </h1>

                    {/* Supporting copy */}
                    <p className="mt-6 text-base sm:text-lg text-white/85 max-w-xl leading-relaxed font-light">
                        Thoughtfully designed spaces, memorable experiences and everything you need for a beautiful, unhurried stay along Karachi's peaceful coast.
                    </p>

                    {/* Primary & Secondary CTAs */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                            onClick={onExploreRooms}
                            className="bg-[#386641] hover:bg-[#2c5133] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-lg hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2E8CF]"
                        >
                            Explore Rooms
                        </button>
                        <button
                            onClick={onExploreRooms}
                            className="border border-white/60 hover:border-white text-white hover:bg-white hover:text-[#161A17] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 backdrop-blur-xs"
                        >
                            Book Your Stay
                        </button>
                    </div>
                </div>

                {/* Integrated Editorial Booking / Reservation Bar */}
                <div className="mt-14 w-full bg-[#FAF7EF] rounded-xs shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] border border-[#E5DAC0] p-4 lg:p-6 text-neutral-900">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSearchAvailability();
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 items-center"
                    >
                        {/* Check In */}
                        <div className="flex flex-col gap-1.5 border-b sm:border-b-0 sm:border-r border-neutral-300/80 pr-3 pb-3 sm:pb-0">
                            <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#386641] flex items-center gap-1.5">
                                <Calendar size={13} strokeWidth={1.5} />
                                Check In
                            </label>
                            <input
                                type="date"
                                value={bookingParams.checkIn}
                                onChange={(e) =>
                                    setBookingParams((prev) => ({ ...prev, checkIn: e.target.value }))
                                }
                                className="bg-transparent text-sm text-neutral-900 font-medium focus:outline-none"
                            />
                        </div>

                        {/* Check Out */}
                        <div className="flex flex-col gap-1.5 border-b sm:border-b-0 lg:border-r border-neutral-300/80 pr-3 pb-3 sm:pb-0">
                            <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#386641] flex items-center gap-1.5">
                                <Calendar size={13} strokeWidth={1.5} />
                                Check Out
                            </label>
                            <input
                                type="date"
                                value={bookingParams.checkOut}
                                onChange={(e) =>
                                    setBookingParams((prev) => ({ ...prev, checkOut: e.target.value }))
                                }
                                className="bg-transparent text-sm text-neutral-900 font-medium focus:outline-none"
                            />
                        </div>

                        {/* Guests */}
                        <div className="flex flex-col gap-1.5 border-b sm:border-b-0 sm:border-r border-neutral-300/80 pr-3 pb-3 sm:pb-0">
                            <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#386641] flex items-center gap-1.5">
                                <Users size={13} strokeWidth={1.5} />
                                Guests
                            </label>
                            <select
                                value={bookingParams.guests}
                                onChange={(e) =>
                                    setBookingParams((prev) => ({ ...prev, guests: Number(e.target.value) }))
                                }
                                className="bg-transparent text-sm text-neutral-900 font-medium focus:outline-none cursor-pointer"
                            >
                                <option value={1}>1 Resident</option>
                                <option value={2}>2 Guests</option>
                                <option value={3}>3 Guests</option>
                                <option value={4}>4+ Family Suite</option>
                            </select>
                        </div>

                        {/* Room Type */}
                        <div className="flex flex-col gap-1.5 border-b sm:border-b-0 pr-3 pb-3 sm:pb-0">
                            <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#386641] flex items-center gap-1.5">
                                <Sparkles size={13} strokeWidth={1.5} />
                                Suite Class
                            </label>
                            <select
                                value={bookingParams.roomType}
                                onChange={(e) =>
                                    setBookingParams((prev) => ({ ...prev, roomType: e.target.value }))
                                }
                                className="bg-transparent text-sm text-neutral-900 font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="all">All Suites & Rooms</option>
                                <option value="deluxe">Deluxe Rooms</option>
                                <option value="executive">Executive Suites</option>
                                <option value="suite">Horizon Suites</option>
                            </select>
                        </div>

                        {/* Check Availability CTA */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-[#386641] hover:bg-[#284c30] text-white py-3.5 px-4 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Search size={14} />
                                Check Availability
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
