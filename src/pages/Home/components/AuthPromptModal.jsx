import React from "react";
import { Link } from "react-router-dom";
import { X, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export const AuthPromptModal = ({ isOpen, onClose, context = "booking" }) => {
    if (!isOpen) return null;

    const isBooking = context === "booking";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[#FAF7EF] text-neutral-900 border border-[#DFD4B7] shadow-2xl p-8 rounded-xs animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral-500 hover:text-neutral-900 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                {/* Icon & Eyebrow */}
                <div className="w-12 h-12 rounded-full bg-[#386641]/10 text-[#386641] flex items-center justify-center mb-5">
                    <Lock size={20} strokeWidth={1.5} />
                </div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                    Guest Account Required
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 mt-2 leading-snug">
                    {isBooking
                        ? "Sign in to reserve your suite"
                        : "Sign in to share your stay experience"}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                    You can freely explore all suites, amenities, and hotel stories without logging in. A guest account is only needed to secure reservations and submit verified reviews.
                </p>

                <div className="mt-6 p-3 bg-white/80 border border-neutral-200 text-neutral-700 text-xs flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#386641] shrink-0 mt-0.5" />
                    <span>Instant room confirmation, transparent rates, and secure check-in management.</span>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3">
                    <Link
                        to="/login"
                        className="w-full bg-[#386641] hover:bg-[#284a30] text-white py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        Sign In Now
                        <ArrowRight size={14} />
                    </Link>

                    <Link
                        to="/signup"
                        className="w-full border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-center transition-colors"
                    >
                        Create New Guest Account
                    </Link>

                    <button
                        onClick={onClose}
                        className="text-xs text-neutral-500 hover:text-neutral-800 tracking-wider pt-2 text-center transition-colors"
                    >
                        Continue browsing accommodations
                    </button>
                </div>
            </div>
        </div>
    );
};
