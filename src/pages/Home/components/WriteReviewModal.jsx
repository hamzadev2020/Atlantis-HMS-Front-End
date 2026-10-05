import React, { useState } from "react";
import { X, Star, Check, AlertCircle } from "lucide-react";
import { submitReview } from "../../../services/homeApi";

export const WriteReviewModal = ({ isOpen, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [category, setCategory] = useState("Ocean Suite Experience");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!message.trim() || message.trim().length < 10) {
            setError("Please share at least a short sentence about your stay (10+ characters).");
            return;
        }

        setLoading(true);
        try {
            await submitReview({ rating, category, message });
            setSuccess(true);
            setTimeout(() => {
                onReviewSubmitted?.();
                onClose();
            }, 1800);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#FAF7EF] text-neutral-900 border border-[#DFD4B7] shadow-2xl p-8 rounded-xs">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral-500 hover:text-neutral-900 transition-colors"
                    aria-label="Close review modal"
                >
                    <X size={20} />
                </button>

                <p className="text-[10px] uppercase tracking-[0.25em] text-[#386641] font-semibold">
                    Guest Feedback • Verified Stay
                </p>
                <h3 className="font-serif text-3xl text-neutral-900 mt-1 leading-snug">
                    Share your experience
                </h3>

                {success ? (
                    <div className="my-8 p-6 bg-[#386641]/10 border border-[#386641] text-center rounded-xs">
                        <div className="w-12 h-12 rounded-full bg-[#386641] text-white flex items-center justify-center mx-auto mb-3">
                            <Check size={20} />
                        </div>
                        <h4 className="font-serif text-2xl text-[#386641]">Thank you for your feedback</h4>
                        <p className="text-xs text-neutral-600 mt-2">
                            Your review has been successfully submitted and helps us uphold our hospitality standards.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border-l-2 border-red-700 text-xs text-red-800 flex items-center gap-2">
                                <AlertCircle size={15} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Rating stars */}
                        <div>
                            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-2">
                                Rating
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={26}
                                            fill={star <= rating ? "#C9A24B" : "none"}
                                            stroke={star <= rating ? "#C9A24B" : "#A69F90"}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                                <span className="ml-3 font-serif text-lg text-neutral-700 font-medium">
                                    {rating} of 5 Stars
                                </span>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                                Stay Experience Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white border border-neutral-300 px-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-[#386641]"
                            >
                                <option value="Ocean Suite Experience">Ocean Suite Stay</option>
                                <option value="Deluxe Room Stay">Deluxe Room Stay</option>
                                <option value="Rooftop Dining & Bar">Rooftop Dining & Bar</option>
                                <option value="Saltwater Infinity Pool">Saltwater Infinity Pool</option>
                                <option value="Anniversary & Romance">Anniversary & Special Occasion</option>
                                <option value="Business & Executive">Business Travel & Retreat</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-700 block mb-1.5">
                                Your Thoughts
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe the atmosphere, room comfort, service, and memories of your stay..."
                                className="w-full bg-white border border-neutral-300 p-3 text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-[#386641] leading-relaxed resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-xs uppercase tracking-wider text-neutral-600 hover:text-neutral-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#386641] hover:bg-[#284a30] disabled:bg-neutral-300 text-white px-7 py-3 text-xs uppercase tracking-[0.16em] font-semibold transition-colors"
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
