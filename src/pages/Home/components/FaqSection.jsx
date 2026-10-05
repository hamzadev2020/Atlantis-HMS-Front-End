import React, { useState } from "react";
import { HOTEL_FAQS } from "../../../config/hotelMedia";
import { Plus, Minus } from "lucide-react";

export const FaqSection = () => {
    const [openIdx, setOpenIdx] = useState(0);

    const toggle = (idx) => {
        setOpenIdx(openIdx === idx ? null : idx);
    };

    return (
        <section id="faq" className="py-24 lg:py-36 bg-white text-neutral-900 border-t border-neutral-200">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-16">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                        Essential Details • Frequently Asked
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-3 leading-tight">
                        Everything to know for your visit
                    </h2>
                </div>

                {/* Accordion list */}
                <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                    {HOTEL_FAQS.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div key={idx} className="py-6">
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between gap-6 text-left group focus:outline-none"
                                >
                                    <h3
                                        className={`font-serif text-xl sm:text-2xl transition-colors duration-200 ${
                                            isOpen
                                                ? "text-[#386641]"
                                                : "text-neutral-900 group-hover:text-[#386641]"
                                        }`}
                                    >
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                            isOpen
                                                ? "bg-[#386641] text-white"
                                                : "bg-[#F2E8CF] text-neutral-700 group-hover:bg-[#386641] group-hover:text-white"
                                        }`}
                                    >
                                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="mt-4 pr-12 text-sm sm:text-base text-neutral-600 font-light leading-relaxed animate-in fade-in duration-300">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
