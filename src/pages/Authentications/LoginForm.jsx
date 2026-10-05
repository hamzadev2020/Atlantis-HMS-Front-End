import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import hotelLogo from '../../assets/HMSLOGO.jpg';
import './login.css';

const API_BASE = import.meta.env.VITE_API_URL;


const BEACH_SLIDES = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80",
];

export const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const LoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${API_BASE}/user/login`, formData);

            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("role", res.data.user.role);

            const role = res.data.user.role;

            const routes = {
                admin: "/Welcome-Admin",
                manager: "/Welcome-Manager",
                receptionist: "/receptionist-analytics",
                housekeeping: "/housekeeping-dashboard",
                guest: "/user-dashboard",
            };

            navigate(routes[role] || "/login");

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong, please try again");
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
                                backgroundImage: `url(${src}), linear-gradient(135deg, #065f46, #10b981)`,
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
                    <h1>Good to see you back by the shore.</h1>
                    <p>Sign in to manage your reservations, or to access your staff console.</p>
                    <span className="lg-foot">Beachfront hostel stays, since day one.</span>
                </div>
            </aside>

            <main className="lg-main">
                <div className="lg-blob lg-blob-a" aria-hidden="true" />
                <div className="lg-blob lg-blob-b" aria-hidden="true" />

                <form className="lg-form" onSubmit={LoginSubmit}>
                    <h2>Log in</h2>
                    <p className="lg-sub">Welcome back.</p>

                    {error && <div className="lg-error" role="alert">{error}</div>}

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
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" autoComplete="current-password" />
                        </div>
                    </label>

                    <button className="lg-submit">Log in</button>

                    <p className="lg-switch">
                        New here? <Link to="/signup">Create an account</Link>
                    </p>
                </form>
            </main>
        </div>
    )
}