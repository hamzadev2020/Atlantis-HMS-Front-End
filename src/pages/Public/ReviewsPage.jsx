import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { WriteReviewModal } from "../Home/components/WriteReviewModal";
import { getReviews, getUserProfile } from "../../services/homeApi";
import { Star, ShieldCheck, PenLine, Filter, CheckCircle2 } from "lucide-react";

export const ReviewsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStar, setFilterStar] = useState("all");

    const [authModal, setAuthModal] = useState({ isOpen: false, context: "review" });
    const [writeReviewModal, setWriteReviewModal] = useState(false);

    const loadData = () => {
        setLoading(true);
        getReviews()
            .then(setReviews)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (token) getUserProfile().then(setUser);
        loadData();
    }, [token]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    const handleWriteReview = () => {
        if (token && role === "guest") {
            setWriteReviewModal(true);
        } else {
            setAuthModal({ isOpen: true, context: "review" });
        }
    };

    const filtered = reviews.filter((r) => {
        if (filterStar === "all") return true;
        return Number(r.rating) === Number(filterStar);
    });

    const averageRating = (
        reviews.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) / (reviews.length || 1)
    ).toFixed(1);

    return (
        <div className="min-h-screen bg-[#F2E8CF] text-neutral-900 selection:bg-[#386641] selection:text-[#F2E8CF]">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onOpenAuthPrompt={() => setAuthModal({ isOpen: true, context: "booking" })}
            />

            <main className="relative z-10 bg-[#F2E8CF] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)]">
                {/* Hero Header */}
                <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-[#161A17] text-white overflow-hidden">
                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A7C957]" />
                            <p className="text-[11px] uppercase tracking-[0.26em] text-[#A7C957] font-semibold">
                                Guest Memories & Ratings • Clifton
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            Words From Our Guests
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Read genuine accounts of quiet mornings, memorable rooftop dining, and attentive hospitality from verified residents.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* Score Summary & Write Review CTA */}
                <section className="py-20 max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="bg-white border border-[#DFD4B7] p-8 sm:p-12 mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-8 lg:pb-0 lg:pr-8">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                                    Overall Experience Score
                                </span>
                                <div className="flex items-baseline gap-3 mt-3">
                                    <span className="font-serif text-6xl text-[#386641] font-semibold">
                                        {averageRating}
                                    </span>
                                    <span className="text-xl text-neutral-400 font-serif">/ 5.0</span>
                                </div>
                                <div className="flex gap-1 text-[#C9A24B] mt-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={18} fill="#C9A24B" strokeWidth={0} />
                                    ))}
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Based on over 250 verified guest stays
                                </p>
                            </div>

                            <div className="lg:col-span-5 space-y-3">
                                {[
                                    { label: "Cleanliness & Linen Quality", score: "5.0" },
                                    { label: "Discreet Concierge Service", score: "4.9" },
                                    { label: "Quietness & Room Acoustics", score: "4.9" },
                                    { label: "Coastal Dining & Breakfast", score: "4.8" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-700">{item.label}</span>
                                        <div className="flex items-center gap-3 w-40">
                                            <div className="h-1.5 flex-1 bg-neutral-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#386641] w-[98%]" />
                                            </div>
                                            <span className="font-mono text-neutral-800 font-semibold">{item.score}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-3 text-center lg:text-right pt-4 lg:pt-0">
                                <button
                                    onClick={handleWriteReview}
                                    className="bg-[#386641] hover:bg-[#284a30] text-white text-xs uppercase tracking-[0.16em] font-semibold px-6 py-4 w-full sm:w-auto transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    <PenLine size={15} />
                                    Write A Review
                                </button>
                                <p className="text-[10px] text-neutral-500 mt-2">
                                    Verified guest accounts only
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter and Reviews Cards */}
                    <div className="flex items-center justify-between border-b border-neutral-300 pb-4 mb-10">
                        <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                            Showing {filtered.length} Verified Reviews
                        </span>
                        <div className="flex gap-2">
                            {["all", "5", "4"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilterStar(f)}
                                    className={`px-3 py-1 text-xs uppercase tracking-wider transition-all ${
                                        filterStar === f
                                            ? "bg-[#386641] text-white"
                                            : "bg-white text-neutral-700 border border-neutral-300"
                                    }`}
                                >
                                    {f === "all" ? "All Stars" : `${f} Stars`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filtered.map((rev) => (
                            <article
                                key={rev._id}
                                className="bg-[#FAF7EF] p-8 border border-[#DFD4B7] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-1 text-[#C9A24B]">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    size={15}
                                                    fill={i <= Number(rev.rating) ? "#C9A24B" : "none"}
                                                    stroke={i <= Number(rev.rating) ? "#C9A24B" : "#A69F90"}
                                                    strokeWidth={1.5}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-[#386641] font-semibold flex items-center gap-1">
                                            <ShieldCheck size={13} />
                                            Verified Resident
                                        </span>
                                    </div>

                                    <p className="text-sm text-neutral-700 leading-relaxed font-light italic">
                                        "{rev.message}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-neutral-300 flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-semibold text-neutral-900">{rev.guestName}</h4>
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-500">{rev.stayType}</p>
                                    </div>
                                    <span className="text-neutral-400">{rev.date}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />

            <AuthPromptModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, context: "review" })}
                context={authModal.context}
            />

            <WriteReviewModal
                isOpen={writeReviewModal}
                onClose={() => setWriteReviewModal(false)}
                onReviewSubmitted={loadData}
            />
        </div>
    );
};
