/**
 * HOTEL MEDIA & ASSETS CONFIGURATION
 * 
 * Instructions:
 * - To use your own video files, place them in the public folder (e.g. public/videos/hero.mp4)
 *   and set HERO_VIDEO: "/videos/hero.mp4".
 * - When HERO_VIDEO is null or fails to load, HERO_IMAGE serves as the high-resolution fallback poster.
 * - Same applies for EXPERIENCE_VIDEO.
 */

export const HOTEL_MEDIA = {
    // -------------------------------------------------------------
    // VIDEO PLACEMENT 01 — HERO
    // Set to your video path (e.g. "/videos/hotel-hero.mp4") or null for still photography fallback
    // -------------------------------------------------------------
    HERO_VIDEO: "/videos/hero.mp4",
    HERO_IMAGE: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop",

    // -------------------------------------------------------------
    // VIDEO PLACEMENT 02 — EXPERIENCE CAMPAIGN
    // Set to your experience video path (e.g. "/videos/hotel-experience.mp4") or null for still photography
    // -------------------------------------------------------------
    EXPERIENCE_VIDEO: null, // REPLACE HERE: set to "/videos/experience.mp4" or public video URL
    EXPERIENCE_IMAGE: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",

    // -------------------------------------------------------------
    // VIDEO PLACEMENT 03 — OPTIONAL DESTINATION / CLOSING
    // -------------------------------------------------------------
    CLOSING_VIDEO: null,
    CLOSING_IMAGE: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",

    // -------------------------------------------------------------
    // EDITORIAL PHOTOGRAPHY ASSETS (Atmospheric, architectural, natural light)
    // -------------------------------------------------------------
    ABOUT_STORY: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop",
    ABOUT_DETAIL: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
    
    // Curated room fallbacks if an uploaded room does not contain images
    ROOM_DELUXE: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
    ROOM_EXECUTIVE: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop",
    ROOM_SUITE: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
    ROOM_PRESIDENTIAL: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",

    // Gallery imagery
    GALLERY: [
        {
            id: 1,
            category: "Suites",
            title: "Oceanview Master Suite",
            subtitle: "Morning light over Clifton shoreline",
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-8 lg:col-span-8 aspect-[16/10]"
        },
        {
            id: 2,
            category: "Atmosphere",
            title: "The Grand Atrium & Lounge",
            subtitle: "Natural travertine and local limestone",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
            span: "col-span-12 md:col-span-4 lg:col-span-4 aspect-[4/5]"
        },
        {
            id: 3,
            category: "Dining",
            title: "Azure Rooftop Restaurant",
            subtitle: "Artisanal coastal dining at dusk",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
            span: "col-span-12 md:col-span-4 lg:col-span-4 aspect-[4/5]"
        },
        {
            id: 4,
            category: "Wellness",
            title: "The Coastal Horizon Pool",
            subtitle: "Heated saltwater infinity edge",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-8 lg:col-span-8 aspect-[16/10]"
        },
        {
            id: 5,
            category: "Architecture",
            title: "Courtyard & Gardens",
            subtitle: "Native coastal flora and shaded walkways",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/11]"
        },
        {
            id: 6,
            category: "Suites",
            title: "Private Sunset Balcony",
            subtitle: "Uninterrupted Arabian Sea panorama",
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
            span: "col-span-12 md:col-span-6 lg:col-span-6 aspect-[16/11]"
        }
    ]
};

export const HOTEL_STATS = [
    { value: "42", suffix: "", label: "Curated Rooms & Suites", description: "Bespoke layouts facing the Arabian Sea" },
    { value: "4.9", suffix: "/5", label: "Guest Satisfaction", description: "Over 250 verified guest reviews" },
    { value: "100", suffix: "%", label: "Natural Sea Breeze", description: "Architectural cross-ventilation design" },
    { value: "24", suffix: "/7", label: "Dedicated Concierge", description: "Personalised local itinerary curations" }
];

export const HOTEL_FACILITIES = [
    {
        icon: "UtensilsCrossed",
        title: "Rooftop Coastal Dining",
        description: "Fresh catch of the Arabian Sea paired with seasonal organic herbs and sunset terrace tables."
    },
    {
        icon: "Waves",
        title: "Heated Saltwater Infinity Pool",
        description: "Year-round temperature-controlled pool overlooking the Clifton coastline with private sun lounges."
    },
    {
        icon: "Wifi",
        title: "High-Speed Fiber Wi-Fi",
        description: "Gigabit-speed coverage throughout rooms, suites, gardens, and meeting salons for seamless connectivity."
    },
    {
        icon: "Car",
        title: "Valet & Private Chauffeur",
        description: "Complimentary valet parking and executive airport transfers upon request with our private fleet."
    },
    {
        icon: "Sparkles",
        title: "Holistic Wellness & Spa",
        description: "Bespoke treatments inspired by coastal botanicals, steam rooms, and private therapy pavilions."
    },
    {
        icon: "Coffee",
        title: "The Garden Café & Bakery",
        description: "Artisanal single-origin roasts, freshly baked morning sourdough, and quiet garden seating."
    }
];

export const HOTEL_FAQS = [
    {
        question: "What are the check-in and check-out times?",
        answer: "Standard check-in begins at 2:00 PM and check-out is at 12:00 PM (noon). Early arrivals and late check-outs can be accommodated upon request and subject to availability."
    },
    {
        question: "Can I explore the hotel and browse room options before logging in?",
        answer: "Yes, our entire website, room portfolio, amenities, guest reviews, and local guide are completely open to explore. You only need to sign in or create a guest profile when confirming a room reservation or submitting a verified review."
    },
    {
        question: "Do you offer airport transfers from Jinnah International Airport?",
        answer: "Yes, our private executive chauffeur service is available 24/7 for arrivals and departures. You can arrange this during reservation or by contacting our front desk concierge team."
    },
    {
        question: "What is your cancellation and modification policy?",
        answer: "Flexible bookings may be amended or cancelled free of charge up to 48 hours prior to your scheduled check-in date. Detailed conditions for specific seasonal rates are presented during reservation."
    },
    {
        question: "Are dining options available for non-staying guests?",
        answer: "Our Rooftop Restaurant and Garden Café warmly welcome non-resident guests for breakfast, lunch, afternoon tea, and dinner. We recommend reserving a table in advance for sunset dining."
    }
];
