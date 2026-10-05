import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initSmoothScroll } from "../../utils/smoothScroll";
import { getRooms, getReviews, getUserProfile } from "../../services/homeApi";

// Modular Section Components
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { FeaturedRoomsSection } from "./components/FeaturedRoomsSection";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { GallerySection } from "./components/GallerySection";
import { ReviewsSection } from "./components/ReviewsSection";
import { GuestJourneySection } from "./components/GuestJourneySection";
import { FaqSection } from "./components/FaqSection";
import { CtaSection } from "./components/CtaSection";
import { Footer } from "./components/Footer";
import { ArchitecturalRibbon } from "./components/ArchitecturalRibbon";

// Modals & Preloader
import { HotelPreloader } from "./components/HotelPreloader";
import { AuthPromptModal } from "./components/AuthPromptModal";
import { WriteReviewModal } from "./components/WriteReviewModal";
import { RoomDetailModal } from "./components/RoomDetailModal";

export const HomePage = () => {
    const navigate = useNavigate();

    // User authentication state
    const [user, setUser] = useState(null);
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    // Dynamic Rooms & Reviews data states
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [roomsError, setRoomsError] = useState("");

    const [reviews, setReviews] = useState([]);

    // Modal states
    const [authModal, setAuthModal] = useState({ isOpen: false, context: "booking" });
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Hero search filter params
    const [bookingParams, setBookingParams] = useState({
        checkIn: "",
        checkOut: "",
        guests: 2,
        roomType: "all"
    });

    // 1. Initialize Lenis Smooth Scrolling on Mount
    useEffect(() => {
        const cleanupScroll = initSmoothScroll();
        return () => cleanupScroll();
    }, []);

    // 2. Fetch User Profile if authenticated
    useEffect(() => {
        const loadProfile = async () => {
            if (!token) {
                setUser(null);
                return;
            }
            const profile = await getUserProfile();
            if (profile) {
                setUser(profile);
            }
        };
        loadProfile();
    }, [token]);

    // 3. Fetch Dynamic Rooms from API
    const loadRooms = async () => {
        setRoomsLoading(true);
        setRoomsError("");
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (err) {
            setRoomsError(err.message || "Failed to load accommodations.");
        } finally {
            setRoomsLoading(false);
        }
    };

    // 4. Fetch Dynamic Reviews from API
    const loadReviews = async () => {
        try {
            const data = await getReviews();
            setReviews(data);
        } catch (err) {
            console.error("Reviews load error:", err);
        }
    };

    useEffect(() => {
        loadRooms();
        loadReviews();
    }, []);

    // Handlers
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setUser(null);
        navigate("/login");
    };

    const handleBookRoom = (room) => {
        // If guest is authenticated, take directly to booking
        if (token && role === "guest") {
            navigate(`/booking/${room._id}`);
        } else {
            // Unauthenticated or not guest: prompt login gently
            setAuthModal({ isOpen: true, context: "booking" });
        }
    };

    const handleWriteReviewClick = () => {
        if (token && role === "guest") {
            setReviewModalOpen(true);
        } else {
            setAuthModal({ isOpen: true, context: "review" });
        }
    };

    const handleSearchAvailability = () => {
        const el = document.getElementById("rooms");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#F2E8CF] text-neutral-900 selection:bg-[#386641] selection:text-[#F2E8CF]">
            {/* Real Boutique Architectural Preloader */}
            <HotelPreloader />

            {/* Sticky Editorial Navbar */}
            <Navbar
                user={user}
                onLogout={handleLogout}
                onOpenAuthPrompt={() => setAuthModal({ isOpen: true, context: "booking" })}
            />

            <main className="relative z-10 bg-[#F2E8CF] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)]">
                {/* 1. Hero Section (Full-width cinematic video background with poster fallback) */}
                <HeroSection
                    bookingParams={bookingParams}
                    setBookingParams={setBookingParams}
                    onSearchAvailability={handleSearchAvailability}
                    onExploreRooms={handleSearchAvailability}
                />

                {/* 2. About / Story Section with animated stats & dual image parallax */}
                <AboutSection />

                {/* Architectural highlights ribbon */}
                <ArchitecturalRibbon />

                {/* 3. Featured Rooms & Suites (Dynamic cards from API, Skeletons, Error handling) */}
                <FeaturedRoomsSection
                    rooms={rooms}
                    loading={roomsLoading}
                    error={roomsError}
                    onBookRoom={handleBookRoom}
                    onViewRoomDetails={(room) => setSelectedRoom(room)}
                    onRetry={loadRooms}
                />

                {/* 4. Amenities & Curated Facilities */}
                <AmenitiesSection />

                {/* 5. Experience Campaign (2nd Video placement / split editorial section) */}
                <ExperienceSection
                    onExplore={() => {
                        const el = document.getElementById("facilities");
                        el?.scrollIntoView({ behavior: "smooth" });
                    }}
                />

                {/* 6. Curated Architectural Gallery */}
                <GallerySection />

                {/* 7. Dynamic Reviews & Verified Ratings */}
                <ReviewsSection
                    reviews={reviews}
                    onWriteReview={handleWriteReviewClick}
                />

                {/* 8. Guest Journey & Booking Steps */}
                <GuestJourneySection />

                {/* 9. FAQ Animated Accordion */}
                <FaqSection />

                {/* 10. Call to Action Banner with photographic parallax */}
                <CtaSection onBookClick={handleSearchAvailability} />
            </main>

            {/* 11. Luxury Editorial Footer with Awwwards Parallax Reveal & Watermark */}
            <Footer />

            {/* Modals */}
            <AuthPromptModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal({ isOpen: false, context: "booking" })}
                context={authModal.context}
            />

            <WriteReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onReviewSubmitted={loadReviews}
            />

            <RoomDetailModal
                room={selectedRoom}
                isOpen={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onBookRoom={handleBookRoom}
            />
        </div>
    );
};
