import React from "react";
import { HOTEL_FACILITIES } from "../../../config/hotelMedia";
import { UtensilsCrossed, Waves, Wifi, Car, Sparkles, Coffee } from "lucide-react";

const ICON_MAP = {
    UtensilsCrossed,
    Waves,
    Wifi,
    Car,
    Sparkles,
    Coffee
};

export const AmenitiesSection = () => {
    return (
        <section id="facilities" className="py-24 lg:py-36 bg-[#161A17] text-[#F2E8CF] relative overflow-hidden">
            {/* Subtle background architectural tone */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                {/* Section Header */}
                <div className="max-w-2xl mb-16 lg:mb-20">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#A7C957] font-semibold">
                        Curated Hospitality • On The Property
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl text-white mt-3 leading-tight">
                        Thoughtful conveniences, <br />
                        <span className="italic font-normal text-[#F2E8CF]">made for slowing down.</span>
                    </h2>
                    <p className="mt-5 text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                        Every service is designed with quiet precision so your time in Karachi feels effortless from dawn till late evening.
                    </p>
                </div>

                {/* Editorial Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {HOTEL_FACILITIES.map((facility, idx) => {
                        const IconComponent = ICON_MAP[facility.icon] || Sparkles;
                        return (
                            <div
                                key={idx}
                                className="group p-8 bg-[#1E241F]/60 border border-white/10 transition-all duration-300 hover:border-[#6A994E]/60 hover:bg-[#1E241F]"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#386641]/40 border border-[#A7C957]/30 flex items-center justify-center text-[#A7C957] mb-6 transition-colors duration-300 group-hover:bg-[#386641] group-hover:text-white">
                                    <IconComponent size={22} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-2xl text-white mb-3">
                                    {facility.title}
                                </h3>
                                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                                    {facility.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
