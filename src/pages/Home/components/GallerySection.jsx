import React, { useState } from "react";
import { HOTEL_MEDIA } from "../../../config/hotelMedia";

export const GallerySection = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Suites", "Atmosphere", "Dining", "Wellness", "Architecture"];

    const items = HOTEL_MEDIA.GALLERY.filter((item) =>
        selectedCategory === "All" ? true : item.category === selectedCategory
    );

    return (
        <section id="gallery" className="py-24 lg:py-36 bg-[#F2E8CF] text-neutral-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                            Visual Journal • Property & Surroundings
                        </p>
                        <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-3 leading-tight">
                            Moments of Quiet Elegance
                        </h2>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-[11px] uppercase tracking-[0.16em] px-4 py-1.5 transition-all duration-200 ${
                                    selectedCategory === cat
                                        ? "bg-[#386641] text-white"
                                        : "bg-white/60 text-neutral-700 hover:bg-white hover:text-neutral-900"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editorial Photo Masonry Grid */}
                <div className="grid grid-cols-12 gap-4 lg:gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative overflow-hidden bg-neutral-200 ${item.span}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Subtle hover overlay with caption */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white pointer-events-none">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A7C957] font-semibold">
                                    {item.category}
                                </span>
                                <h3 className="font-serif text-2xl text-[#F2E8CF] mt-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-white/80 font-light mt-1">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
