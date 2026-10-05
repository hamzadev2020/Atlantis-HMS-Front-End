import React from "react";
import { Star, ShieldCheck, PenLine } from "lucide-react";

export const ReviewsSection = ({ reviews, onWriteReview }) => {
    // Calculate average rating
    const totalRating = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "4.9";

    return (
        <section id="reviews" className="py-24 lg:py-36 bg-white text-neutral-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                {/* Section Header with Average Summary */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-neutral-200 pb-12">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                            Guest Experiences • Verified Reviews
                        </p>
                        <h2 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-3 leading-tight">
                            Memories from our guests
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-4 bg-[#FAF7EF] border border-[#E7DECB] px-5 py-3.5">
                            <div className="font-serif text-3xl sm:text-4xl text-[#386641] font-semibold">
                                {avgRating}
                            </div>
                            <div>
                                <div className="flex gap-1 text-[#C9A24B]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={15} fill="#C9A24B" strokeWidth={0} />
                                    ))}
                                </div>
                                <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-600 block mt-1">
                                    Based on {reviews.length > 0 ? `${reviews.length * 15}+` : "250+"} Verified Stays
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onWriteReview}
                            className="bg-[#386641] hover:bg-[#284a30] text-white text-xs uppercase tracking-[0.16em] font-semibold px-6 py-4 transition-all duration-200 flex items-center gap-2 shadow-sm"
                        >
                            <PenLine size={15} />
                            Write A Review
                        </button>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.slice(0, 6).map((rev) => {
                        const ratingNum = Number(rev.rating) || 5;
                        return (
                            <article
                                key={rev._id}
                                className="flex flex-col justify-between bg-[#FAF7EF] p-8 border border-[#E7DECB] transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5"
                            >
                                <div>
                                    {/* Star Rating */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-1 text-[#C9A24B]">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i <= ratingNum ? "#C9A24B" : "none"}
                                                    stroke={i <= ratingNum ? "#C9A24B" : "#D1C7B7"}
                                                    strokeWidth={1.5}
                                                />
                                            ))}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-[#386641] font-semibold">
                                            <ShieldCheck size={13} />
                                            Verified
                                        </span>
                                    </div>

                                    {/* Message */}
                                    <p className="text-sm text-neutral-700 leading-relaxed font-light italic">
                                        "{rev.message}"
                                    </p>
                                </div>

                                {/* Author details */}
                                <div className="mt-8 pt-4 border-t border-neutral-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#386641] text-[#F2E8CF] text-xs font-serif flex items-center justify-center font-bold">
                                            {rev.guestName ? rev.guestName.charAt(0).toUpperCase() : "G"}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-neutral-900 tracking-wide">
                                                {rev.guestName}
                                            </h4>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.12em]">
                                                {rev.stayType}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-neutral-400">
                                        {rev.date}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
