import { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import hotelLogo from '../../assets/HMSLOGO.jpg';
import './login.css';
import { uploadImage } from "../../config/cloudinary.js";

/* UI only: beach photos for the left panel (Unsplash). Swap any URL here to change a slide. */
const BEACH_SLIDES = [
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
];

const API_BASE = import.meta.env.VITE_API_URL;


export const SignUpForm = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
        };
    }, [profilePhotoPreview]);

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files?.[0] || null;
        setProfilePhoto(file);
        setProfilePhotoPreview(file ? URL.createObjectURL(file) : "");
        event.target.value = "";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const SignUpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const profileImage = profilePhoto ? await uploadImage(profilePhoto) : "";
            const res = await axios.post(`${API_BASE}/user/signup`, { ...formData, profileImage });
            console.log(res.data);
            setFormData({ name: "", email: "", password: "" });
            setProfilePhoto(null);

            const role = res.data.user.role;
            const routes = {
                admin: "/admin-dashboard",
                manager: "/manager-dashboard",
                receptionist: "/receptionist-dashboard",
                housekeeping: "/housekeeping-dashboard",
                guest:"/login"
            };
            navigate(routes[role] || "/login");

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong, please try again");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="lg-page">
            <aside className="lg-aside">
                {/* Crossfading beach photos (pure CSS animation, green gradient shows if an image fails) */}
                <div className="lg-slides" aria-hidden="true">
                    {BEACH_SLIDES.map((src, i) => (
                        <div
                            key={src}
                            className="lg-slide"
                            style={{
                                backgroundImage: `url(${src}), linear-gradient(135deg, #14201B, #1E3D2F)`,
                                animationDelay: `${i * 6}s`,
                            }}
                        />
                    ))}
                </div>
                <div className="lg-overlay" aria-hidden="true" />

                <div className="lg-mark">
                    <img src={hotelLogo} alt="Hotel Management System" />
                </div>

                <div className="lg-copy">
                    <div className="lg-chips">
                        <span>Beachfront</span>
                        <span>Hostel stays</span>
                        <span>Sunset views</span>
                    </div>
                    <h1>Your beach stay starts with a simple hello.</h1>
                    <p>Create an account to book your stay by the sea, track your visits, and hear about seasonal offers first.</p>
                    <span className="lg-foot">Beachfront hostel stays, since day one.</span>
                </div>
            </aside>

            <main className="lg-main">
                <div className="lg-blob lg-blob-a" aria-hidden="true" />
                <div className="lg-blob lg-blob-b" aria-hidden="true" />

                <form className="lg-form" onSubmit={SignUpSubmit}>
                    <div className="lg-profile-upload">
                        <label className="lg-profile-photo" htmlFor="signup-profile-photo">
                            <input
                                id="signup-profile-photo"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePhotoChange}
                            />
                            {profilePhotoPreview ? (
                                <img src={profilePhotoPreview} alt="Selected profile" />
                            ) : (
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                                </svg>
                            )}
                            <span className="lg-profile-camera" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 4h-4L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                </svg>
                            </span>
                        </label>
                        <span className="lg-profile-caption">
                            {profilePhoto ? "Change profile photo" : "Add profile photo"}
                        </span>
                    </div>
                    <h2>Create your account</h2>
                    <p className="lg-sub">Takes less than a minute.</p>

                    {error && <div className="lg-error" role="alert">{error}</div>}

                    <label className="lg-field">
                        <span>Full name</span>
                        <div className="lg-input">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                            </svg>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" />
                        </div>
                    </label>

                    <label className="lg-field">
                        <span>Email</span>
                        <div className="lg-input">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                                <path d="m4 7 8 6 8-6" />
                            </svg>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                        </div>
                    </label>

                    <label className="lg-field">
                        <span>Password</span>
                        <div className="lg-input">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="4" y="10" width="16" height="10" rx="2.5" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" />
                        </div>
                    </label>

                    <button className="lg-submit" disabled={submitting}>{submitting ? "Creating account…" : "Sign up"}</button>

                    <p className="lg-switch">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </form>
            </main>
        </div>
    )
}