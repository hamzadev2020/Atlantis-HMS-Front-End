import React from "react";
import { Compass, CalendarCheck, Sparkles, KeyRound } from "lucide-react";

export const GuestJourneySection = () => {
    const steps = [
        {
            number: "01",
            icon: Compass,
            title: "Select Your Space",
            description: "Explore our collection of 42 architectural ocean-facing rooms and suites with transparent rates and verified amenities."
        },
        {
            number: "02",
            icon: CalendarCheck,
            title: "Seamless Reservation",
            description: "Reserve in a few calm clicks with flexible booking, zero hidden fees, and instant confirmation straight to your inbox."
        },
        {
            number: "03",
            icon: KeyRound,
            title: "Warm Coastal Arrival",
            description: "Enjoy our valet service, bespoke check-in refreshments, and dedicated butler escort to your private quarters."
        },
        {
            number: "04",
            icon: Sparkles,
            title: "Unhurried Living",
            description: "Indulge in rooftop dining, quiet garden courtyards, heated saltwater swimming, and Clifton's finest sunsets."
        }
    ];

    return (
        <section className="py-24 lg:py-32 bg-[#F2E8CF] text-neutral-900 border-t border-[#E5DAC0]">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="max-w-2xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                        The Guest Journey • Simple & Unhurried
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-3 leading-tight">
                        How your stay unfolds
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative flex flex-col justify-between p-6 bg-white/70 border border-[#E3D7BC]">
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="font-serif text-3xl text-[#6A994E] font-medium">
                                            {step.number}
                                        </span>
                                        <div className="w-9 h-9 rounded-full bg-[#386641]/10 flex items-center justify-center text-[#386641]">
                                            <Icon size={18} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-xl text-neutral-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
