import axios from "axios";
import { HOTEL_MEDIA } from "../config/hotelMedia";

const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

const CURATED_FALLBACK_REVIEWS = [
    {
        _id: "rev-1",
        guestName: "Ayesha & Farhan Khan",
        rating: 5,
        stayType: "Executive Ocean Suite",
        date: "September 2026",
        message: "The natural light and silence in the room overlooking Clifton beach is unmatched. The front desk and housekeeping were discreet, polished, and exceptionally attentive. We extended our stay by two days."
    },
    {
        _id: "rev-2",
        guestName: "Tariq Mansoor",
        rating: 5,
        stayType: "Deluxe King Room",
        date: "August 2026",
        message: "An architectural breath of fresh air in Karachi. The materials, the quiet garden courtyards, and the rooftop sea breezes make it feel like a genuine European boutique hideaway. Impeccable breakfast."
    },
    {
        _id: "rev-3",
        guestName: "Dr. Sarah Al-Sabah",
        rating: 5,
        stayType: "Presidential Horizon Suite",
        date: "August 2026",
        message: "Every little touch was considered — from arrival refreshments to the high-thread linen and serene pool ambiance. By far the finest hospitality experience in Clifton."
    },
    {
        _id: "rev-4",
        guestName: "Zainab & Bilal Merchant",
        rating: 5,
        stayType: "Executive Suite",
        date: "July 2026",
        message: "Booked for our wedding anniversary. The balcony views of the Arabian Sea at sunset are unforgettable. Quiet, calming, and truly relaxing."
    }
];

export const getRooms = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Try public endpoint first, fallback to ManageRooms
        let res;
        try {
            res = await axios.get(`${BASE_URL}/ManageRooms/public`, { headers, timeout: 6000 });
        } catch {
            res = await axios.get(`${BASE_URL}/ManageRooms`, { headers, timeout: 6000 });
        }

        const data = Array.isArray(res.data)
            ? res.data
            : res.data.rooms || res.data.data || [];

        if (data && data.length > 0) {
            return data.map((room, idx) => {
                const roomType = room.roomType || "Deluxe Suite";
                let defaultImg = HOTEL_MEDIA.ROOM_DELUXE;
                if (roomType.toLowerCase().includes("suite")) defaultImg = HOTEL_MEDIA.ROOM_SUITE;
                else if (roomType.toLowerCase().includes("executive")) defaultImg = HOTEL_MEDIA.ROOM_EXECUTIVE;

                let image = defaultImg;
                if (Array.isArray(room.images) && room.images.length > 0) {
                    image = room.images[0];
                } else if (typeof room.images === "string" && room.images.trim()) {
                    image = room.images;
                }

                return {
                    _id: room._id || `room-${idx}`,
                    roomNumber: room.roomNumber || `10${idx + 1}`,
                    roomType: room.roomType || "Deluxe Room",
                    pricePerNight: room.pricePerNight || 35000,
                    capacity: room.capacity || 2,
                    description: room.description || "Spacious architectural room with floor-to-ceiling windows, refined natural wood finishes, and ocean air ventilation.",
                    status: (room.status || "available").toLowerCase(),
                    image,
                    images: Array.isArray(room.images) && room.images.length > 0 ? room.images : [image],
                    amenities: room.amenities || ["King Bed", "Ocean View", "Fiber Wi-Fi", "Rain Shower", "Espresso Bar"]
                };
            });
        }

        return getFallbackRooms();
    } catch (err) {
        console.warn("Could not fetch rooms from API, using curated boutique rooms:", err.message);
        return getFallbackRooms();
    }
};

export const getFallbackRooms = () => [
    {
        _id: "room-deluxe-101",
        roomNumber: "101",
        roomType: "Deluxe Ocean Room",
        pricePerNight: 28000,
        capacity: 2,
        description: "Quiet room with private coastal terrace, handmade linen, artisanal coffee bar, and bespoke travertine bathroom.",
        status: "available",
        image: HOTEL_MEDIA.ROOM_DELUXE,
        images: [HOTEL_MEDIA.ROOM_DELUXE, HOTEL_MEDIA.ROOM_SUITE],
        amenities: ["King Bed", "Private Terrace", "Rain Shower", "Free Wi-Fi"]
    },
    {
        _id: "room-exec-204",
        roomNumber: "204",
        roomType: "Executive Suite",
        pricePerNight: 42000,
        capacity: 3,
        description: "Expansive living salon, double-aspect ocean views, custom walnut joinery, and private sunset dining table.",
        status: "available",
        image: HOTEL_MEDIA.ROOM_EXECUTIVE,
        images: [HOTEL_MEDIA.ROOM_EXECUTIVE, HOTEL_MEDIA.ROOM_DELUXE],
        amenities: ["King Bed", "Living Salon", "Ocean Panorama", "Espresso Machine"]
    },
    {
        _id: "room-pres-305",
        roomNumber: "305",
        roomType: "Presidential Horizon Suite",
        pricePerNight: 65000,
        capacity: 4,
        description: "Penthouse floor suite with wraparound terrace overlooking the Arabian Sea, private soaking tub, and dedicated butler.",
        status: "available",
        image: HOTEL_MEDIA.ROOM_SUITE,
        images: [HOTEL_MEDIA.ROOM_SUITE, HOTEL_MEDIA.ROOM_PRESIDENTIAL],
        amenities: ["Two Bedrooms", "Wraparound Balcony", "Private Butler", "Deep Soaking Tub"]
    }
];

export const getReviews = async () => {
    try {
        let res;
        try {
            res = await axios.get(`${BASE_URL}/guest-communications/public`, { timeout: 5000 });
        } catch {
            res = await axios.get(`${BASE_URL}/reviews`, { timeout: 5000 });
        }

        const items = res.data?.reviews || res.data?.communications || [];
        if (Array.isArray(items) && items.length > 0) {
            const mapped = items.map((rev) => ({
                _id: rev._id,
                guestName: rev.guest?.name || rev.name || "Verified Resident",
                rating: rev.rating || 5,
                stayType: rev.category || "Verified Stay",
                date: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent Stay",
                message: rev.message || ""
            })).filter(r => r.message.length > 5);

            if (mapped.length > 0) {
                return mapped;
            }
        }
        return CURATED_FALLBACK_REVIEWS;
    } catch {
        return CURATED_FALLBACK_REVIEWS;
    }
};

export const submitReview = async ({ rating, category, message }) => {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Please log in with your guest account to share feedback.");

    const res = await axios.post(
        `${BASE_URL}/guest-communications`,
        {
            type: "feedback",
            rating: Number(rating),
            category: category || "General Stay",
            message: message.trim()
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data;
};

export const getUserProfile = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const res = await axios.get(`${BASE_URL}/ManageProfile/viewprofile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
        }
        return null;
    }
};
