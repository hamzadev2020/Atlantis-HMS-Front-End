import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Camera,
  CalendarDays,
  ConciergeBell,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import axios from "axios";
import "./guest-shell.css";
import hotelLogo from "../../assets/HMSLOGO.jpg";
import { uploadImage } from "../../config/cloudinary.js";

const guestLinks = [
  { label: "Overview", to: "/user-dashboard", icon: LayoutDashboard },
  { label: "My stays", to: "/mybookings", icon: CalendarDays },
  { label: "Request a service", to: "/guest-service-requests", icon: ConciergeBell },
  { label: "Contact hotel", to: "/guest-contact", icon: MessageSquareText },
  { label: "Share feedback", to: "/guest-feedback", icon: MessageSquareText },
  { label: "Privacy policy", to: "/guest-privacy-policy", icon: ShieldCheck },
  { label: "My profile", to: "/my-profile", icon: UserRound },
];

export const GuestShell = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const photoInputRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = Boolean(sessionStorage.getItem("token") && sessionStorage.getItem("role") === "guest");
  const visibleGuestLinks = isAuthenticated
    ? guestLinks
    : guestLinks.filter(({ to }) => ["/user-dashboard", "/guest-privacy-policy"].includes(to));

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:5000/api/ManageProfile/viewprofile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => setProfile(response.data)).catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    const updateProfile = (event) => setProfile((current) => ({ ...current, ...event.detail }));
    window.addEventListener("profile-updated", updateProfile);
    return () => window.removeEventListener("profile-updated", updateProfile);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  const changeProfilePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoUploading(true);
    setPhotoError("");
    try {
      const profileImage = await uploadImage(file);
      const { data } = await axios.post(
        "http://localhost:5000/api/ManageProfile/updateprofile",
        { profileImage },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
      );
      const updatedProfile = data.user;
      setProfile((current) => ({ ...current, ...updatedProfile }));
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: updatedProfile }));
    } catch (requestError) {
      setPhotoError(requestError.response?.data?.message || requestError.message || "Profile photo could not be saved.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const initial = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  return (
    <div className="guest-app">
      <header className="guest-topbar">
        <NavLink className="guest-brand" to="/user-dashboard" aria-label="Atlantis guest home">
          <img className="guest-brand-mark" src={hotelLogo} alt="" />
          <span className="guest-brand-copy">
            <strong>ATLANTIS</strong>
            <small>HOTEL &amp; RESIDENCE</small>
          </span>
        </NavLink>
        <div className="guest-topbar-right">
          {isAuthenticated ? (
            <>
              <div className="guest-welcome">
                <span>Welcome back</span>
                <strong>{profile?.name || "Guest"}</strong>
              </div>
              <input
                ref={photoInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={changeProfilePhoto}
              />
              <button
                className="guest-avatar guest-avatar-edit"
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={photoUploading}
                aria-label={photoUploading ? "Uploading profile photo" : "Change profile photo"}
                title={photoUploading ? "Uploading profile photo…" : "Change profile photo"}
              >
                {profile?.profileImage ? <img src={profile.profileImage} alt="" /> : initial}
                <span className="guest-avatar-camera" aria-hidden="true"><Camera size={13} /></span>
              </button>
              <button className="guest-logout" type="button" onClick={logout} aria-label="Log out" title="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="guest-auth-actions">
              <Link to="/login">Log in</Link>
              <Link to="/signup">Create account</Link>
            </div>
          )}
        </div>
      </header>

      <div className="guest-frame">
        <aside className="guest-sidebar" aria-label="Guest navigation">
          <p className="guest-nav-label">YOUR STAY</p>
          <nav className="guest-nav-list">
            {visibleGuestLinks.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/user-dashboard"}
                className={({ isActive }) => `guest-nav-link${isActive ? " is-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="guest-sidebar-note">
            <span className="guest-note-mark">A</span>
            <p>Your time here<br /><strong>should feel easy.</strong></p>
          </div>
        </aside>
        <main className="guest-main">
          {photoError && <div className="guest-alert" role="alert">{photoError}</div>}
          {children}
        </main>
      </div>

      <nav className="guest-mobile-nav" aria-label="Guest navigation">
        {visibleGuestLinks.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/user-dashboard"}
            aria-label={label}
            className={({ isActive }) => `guest-mobile-link${isActive ? " is-active" : ""}`}
          >
            <Icon size={19} />
            <span>{label === "Request a service" ? "Services" : label === "My stays" ? "Stays" : label === "My profile" ? "Profile" : label === "Contact hotel" ? "Contact" : label === "Share feedback" ? "Feedback" : label === "Privacy policy" ? "Privacy" : "Home"}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};