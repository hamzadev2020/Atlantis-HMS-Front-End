import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../GuestNavabr/navbar.css";

const API_BASE = import.meta.env.VITE_API_URL;


export const LandingNavbar = () => {
const navigate = useNavigate();

const [profiledata, setProfiledata] = useState({});
const [scrolled, setScrolled] = useState(false);

const token = sessionStorage.getItem("token");


// Get logged-in user's profile
const GetProfile = async () => {
    try {
        if (!token) return;

        const res = await axios.get(
            `${API_BASE}/ManageProfile/viewprofile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setProfiledata(res.data);

    } catch (error) {
        console.log("Profile Error:", error);

        if (error.response?.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            setProfiledata({});
        }
    }
};

// Logout
const Logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    setProfiledata({});

    navigate("/login");
};

// Scroll effect
useEffect(() => {
    GetProfile();

    const handleScroll = () => {
        if (window.scrollY > 420) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, []);

// Book Now
const handleBookNow = () => {
    document
        .getElementById("book")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
};

return (
    <nav className={`landing-navbar ${scrolled ? "navbar-scrolled" : ""}`}>

        {/* Logo */}
        <Link to="/" className="landing-brand">
            <div className="landing-brand-mark">
                A
            </div>

            <span className="landing-brand-name">
                Atlantis
            </span>
        </Link>


        {/* Navigation Links */}
        <div className="landing-nav-links">

            <a href="#about">
                About
            </a>

            <a href="#rooms">
                Rooms
            </a>

            <a href="#facilities">
                Facilities
            </a>

            <a href="#nearby">
                Karachi
            </a>

            <a href="#reviews">
                Reviews
            </a>


            {profiledata?.name ? (
                <div className="landing-user-section">

                    <span className="landing-user-name">
                        Hi, {profiledata.name}
                    </span>

                    <button
                        className="landing-logout-btn"
                        onClick={Logout}
                    >
                        Logout
                    </button>

                </div>
            ) : (
                <Link
                    to="/login"
                    className="landing-login-btn"
                >
                    Login
                </Link>
            )}

        </div>


        {/* Book Now Button */}
        <button
            className="landing-book-btn"
            onClick={handleBookNow}
        >
            Book Now
        </button>

    </nav>
);
};
