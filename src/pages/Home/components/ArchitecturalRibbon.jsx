import React from "react";

export const ArchitecturalRibbon = ({ text }) => {
    const defaultItems = [
        "Clifton Shoreline",
        "42 Architectural Suites",
        "Natural Ocean Breeze",
        "Saltwater Infinity Pool",
        "Unhurried Living",
        "Bespoke Butler Service",
        "Atlantis The Royal"
    ];

    const items = text || defaultItems;

    return (
        <aside
            aria-label="Hotel highlights ribbon"
            className="w-full bg-[#181E19] text-[#F2E8CF] py-4 border-y border-white/10 overflow-hidden select-none pointer-events-none"
        >
            <div className="flex w-max items-center animate-[marquee_38s_linear_infinite]">
                {[...items, ...items, ...items].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 mx-4">
                        <span className="font-serif text-sm sm:text-base uppercase tracking-[0.25em] text-[#F2E8CF]/90 font-light whitespace-nowrap">
                            {item}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]/70" />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}</style>
        </aside>
    );
};
