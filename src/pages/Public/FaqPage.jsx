import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/components/Navbar";
import { Footer } from "../Home/components/Footer";
import { ArchitecturalRibbon } from "../Home/components/ArchitecturalRibbon";
import { AuthPromptModal } from "../Home/components/AuthPromptModal";
import { getUserProfile } from "../../services/homeApi";
import { Search, Plus, Minus, Phone, Mail, HelpCircle } from "lucide-react";

export const FaqPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const [authModal, setAuthModal] = useState({ isOpen: false, context: "booking" });

    const [searchQuery, setSearchQuery] = useState("");
    const [openIdx, setOpenIdx] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (token) getUserProfile().then(setUser);
    }, [token]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    const faqs = [
        {
            category: "Arrivals & Departures",
            question: "What are the standard check-in and check-out times?",
            answer: "Check-in begins at 2:00 PM and check-out is at 12:00 PM (noon). Early arrivals and late departures are accommodated upon request, subject to availability."
        },
        {
            category: "Arrivals & Departures",
            question: "How do I arrange an airport transfer from Jinnah International Airport?",
            answer: "Our private chauffeur fleet is available 24/7. When reserving your suite, specify your flight details, or contact our front desk at concierge@atlantishotel.pk at least 24 hours prior to arrival."
        },
        {
            category: "Reservations & Policies",
            question: "Can I explore the hotel website and view suite details without logging in?",
            answer: "Yes, our website is entirely open for exploration. You can view all 42 suites, photo journals, amenity guides, and verified reviews freely. A guest login is only requested when finalizing a reservation or posting a review."
        },
        {
            category: "Reservations & Policies",
            question: "What is your cancellation and refund policy?",
            answer: "Direct reservations may be cancelled or modified up to 48 hours prior to your scheduled arrival with zero penalty. Non-refundable promotional rates are clearly designated during reservation."
        },
        {
            category: "Suites & Living",
            question: "Do all rooms feature an ocean view?",
            answer: "Due to our cross-ventilation coastal orientation, all Deluxe Rooms and Suites offer direct or angled panoramas of the Clifton shoreline and Arabian Sea."
        },
        {
            category: "Suites & Living",
            question: "Is high-speed Wi-Fi included in the room rate?",
            answer: "Yes, complimentary enterprise-grade fiber Wi-Fi (up to 300 Mbps) is provided across all private suites, public lounges, and garden courtyards."
        },
        {
            category: "Dining & Experiences",
            question: "Are non-resident guests welcome at the Azure Rooftop Restaurant?",
            answer: "Yes, our restaurant warmly welcomes outside guests for breakfast, lunch, and sunset dinner. Prior table reservation is strongly recommended for twilight dining."
        },
        {
            category: "Dining & Experiences",
            question: "Can special dietary preferences be accommodated?",
            answer: "Our culinary team caters thoughtfully to vegetarian, gluten-free, halal, and specific allergen requests. Simply notify our concierge when booking or ordering."
        }
    ];

    const filtered = faqs.filter(
        (f) =>
            f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                Guest Guidance & Knowledge Base
                            </p>
                        </div>
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
                            Practical information regarding arrivals, reservations, suite amenities, and dining across Atlantis The Royal.
                        </p>
                    </div>
                </section>

                <ArchitecturalRibbon />

                {/* FAQ Content & Search */}
                <section className="py-24 max-w-4xl mx-auto px-6 lg:px-10">
                    {/* Search Bar */}
                    <div className="relative mb-14">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions by topic (e.g. transfers, dining, check-in)..."
                            className="w-full bg-white border border-[#DFD4B7] px-5 py-4 pl-12 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#386641] shadow-sm"
                        />
                        <Search size={18} className="absolute left-4 top-4.5 text-neutral-400" />
                    </div>

                    {/* Accordion */}
                    <div className="divide-y divide-[#E0D5BE] border-y border-[#E0D5BE]">
                        {filtered.map((item, idx) => {
                            const isOpen = openIdx === idx;
                            return (
                                <div key={idx} className="py-6">
                                    <button
                                        onClick={() => setOpenIdx(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between gap-6 text-left group focus:outline-none"
                                    >
                                        <div>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#386641] font-semibold block mb-1">
                                                {item.category}
                                            </span>
                                            <h3
                                                className={`font-serif text-xl sm:text-2xl transition-colors ${
                                                    isOpen ? "text-[#386641]" : "text-neutral-900 group-hover:text-[#386641]"
                                                }`}
                                            >
                                                {item.question}
                                            </h3>
                                        </div>
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                                isOpen
                                                    ? "bg-[#386641] text-white"
                                                    : "bg-white text-neutral-700 border border-neutral-300 group-hover:bg-[#386641] group-hover:text-white"
                                            }`}
                                        >
                                            {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="mt-4 pr-12 text-sm sm:text-base text-neutral-600 font-light leading-relaxed animate-in fade-in duration-300">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Concierge Direct Inquiry Box */}
                    <div className="mt-20 p-8 sm:p-10 bg-white border border-[#DFD4B7] flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#386641] font-semibold">
                                Unanswered Questions?
                            </span>
                            <h4 className="font-serif text-2xl text-neutral-900 mt-1">Speak with our Front Desk</h4>
                            <p className="text-xs text-neutral-600 font-light mt-1">
                                Our concierge is on duty 24/7 to assist with bespoke itineraries or arrival arrangements.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <a
                                href="tel:+922135830000"
                                className="bg-[#386641] hover:bg-[#284a30] text-white px-5 py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                            >
                                <Phone size={14} />
                                +92 21 3583 0000
                            </a>
                            <a
                                href="mailto:stay@atlantishotel.pk"
                                className="border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 px-5 py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                            >
                                <Mail size={14} />
                                Email Desk
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <AuthPromptModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, context: "booking" })}
                context={authModal.context}
            />
        </div>
    );
};
