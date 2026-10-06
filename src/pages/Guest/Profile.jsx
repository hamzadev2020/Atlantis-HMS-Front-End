import { useEffect, useRef, useState } from "react";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";
import "./guest-pages.css";
import { uploadImage } from "../../config/cloudinary.js";

const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });

export const GuestProfile = () => {
  const [profile, setProfile] = useState(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const profileImageInput = useRef(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/ManageProfile/viewprofile`, authConfig()),
      axios.get(`${API}/ManageBookings/my-bookings`, authConfig()),
    ]).then(([profileResponse, bookingResponse]) => {
      setProfile(profileResponse.data);
      setName(profileResponse.data?.name || "");
      setBookingCount(bookingResponse.data?.bookings?.length || 0);
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "We could not load your profile.");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => () => {
    if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
  }, [profileImagePreview]);

  const initial = profile?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const profileImage = profileImageFile ? await uploadImage(profileImageFile) : undefined;
      const response = await axios.post(
        `${API}/ManageProfile/updateprofile`,
        { name, password, ...(profileImage ? { profileImage } : {}) },
        authConfig()
      );
      const updatedProfile = response.data?.user;
      setProfile((current) => ({ ...current, ...updatedProfile, name: updatedProfile?.name || name.trim() }));
      setName(updatedProfile?.name || name.trim());
      window.dispatchEvent(new CustomEvent("profile-updated", { detail: updatedProfile || { name: name.trim() } }));
      setProfileImageFile(null);
      setProfileImagePreview("");
      setPassword("");
      setEditing(false);
      setNotice("Your profile has been updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Your profile could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const selectProfileImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  return (
    <GuestShell>
      <div className="guest-page-heading">
        <div><span className="guest-eyebrow">YOUR DETAILS</span><h1>Guest profile</h1><p>Your account information and reservation overview.</p></div>
      </div>
      {error && <div className="guest-alert" role="alert">{error}</div>}
      {notice && <div className="guest-alert success" role="status">{notice}</div>}
      {loading ? <div className="guest-empty-state">Loading your profile…</div> : (
        <div className="guest-profile-grid">
          <section className="guest-profile-card">
            {!editing ? (
              <>
                <div className="guest-profile-identity">
                  <div className="guest-profile-avatar overflow-hidden">
                    {profile?.profileImage ? <img src={profile.profileImage} alt="" className="h-full w-full object-cover" /> : initial}
                  </div>
                  <h2>{profile?.name || "Guest"}</h2>
                  <p>{profile?.email || "Email not available"}</p>
                  <span className="guest-profile-role">{profile?.role || "Guest"}</span>
                </div>
                <div className="guest-profile-details">
                  <div className="guest-profile-detail"><span><UserRound size={13} /> Full name</span><strong>{profile?.name || "Not provided"}</strong></div>
                  <div className="guest-profile-detail"><span><Mail size={13} /> Email address</span><strong>{profile?.email || "Not provided"}</strong></div>
                  <div className="guest-profile-detail"><span><ShieldCheck size={13} /> Account role</span><strong>{profile?.role || "Guest"}</strong></div>
                  <div className="guest-profile-detail"><span><CalendarDays size={13} /> Member since</span><strong>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "Atlantis guest"}</strong></div>
                </div>
                <button className="guest-action-button" type="button" onClick={() => setEditing(true)}>Edit profile</button>
              </>
            ) : (
              <form className="guest-form" onSubmit={saveProfile}>
                <div><span className="guest-eyebrow">ACCOUNT SETTINGS</span><h2>Update your details</h2></div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="guest-profile-avatar overflow-hidden">
                    {profileImagePreview || profile?.profileImage
                      ? <img src={profileImagePreview || profile.profileImage} alt="Profile preview" className="h-full w-full object-cover" />
                      : initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <input ref={profileImageInput} className="sr-only" type="file" accept="image/*" onChange={selectProfileImage} />
                    <button className="guest-action-button secondary" type="button" onClick={() => profileImageInput.current?.click()}>
                      {profileImageFile ? "Choose a different photo" : "Upload profile photo"}
                    </button>
                    <p className="mt-1 text-xs text-slate-500">
                      {profileImageFile ? `${profileImageFile.name} · saved with your profile` : "Choose an image up to 10 MB."}
                    </p>
                  </div>
                </div>
                <div className="guest-field"><label htmlFor="profile-name">Full name</label><input id="profile-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
                <div className="guest-field"><label htmlFor="profile-password">New password <span>(optional)</span></label><input id="profile-password" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Leave blank to keep your current password" /></div>
                <div className="guest-history-actions">
                  <button className="guest-action-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
                  <button className="guest-action-button secondary" type="button" onClick={() => { setEditing(false); setName(profile?.name || ""); setPassword(""); setProfileImageFile(null); setProfileImagePreview(""); }}>Cancel</button>
                </div>
              </form>
            )}
          </section>
          <aside className="guest-profile-summary">
            <article className="guest-stat-card guest-stat-green">
              <span className="guest-stat-label">YOUR ATLANTIS STAYS</span>
              <strong>{bookingCount.toString().padStart(2, "0")}</strong>
              <small>reservations linked to this account</small>
            </article>
            <p>Your account keeps your reservations and invoices together. For a name or account update, please contact the reception desk.</p>
            <Link className="guest-action-button" to="/mybookings"><CalendarDays size={15} /> Open booking history</Link>
          </aside>
        </div>
      )}
    </GuestShell>
  );
};