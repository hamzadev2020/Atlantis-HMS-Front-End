import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ConciergeBell, MapPin, MessageCircle, ReceiptText, ShieldCheck, Sparkles, Star, UserRound } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";
import "./guest-pages.css";
const API_BASE = import.meta.env.VITE_API_URL;


const API = `${API_BASE}/ManageBookings`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });

const money = (value) => new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

const roomImage = (room) => {
  const image = Array.isArray(room?.images) ? room.images[0] : room?.images;
  return typeof image === "string" && image.trim() ? image : "";
};

const dateLabel = (date) => date
  ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  : "Date pending";

export const UserDashboard = () => {
  const isAuthenticated = Boolean(sessionStorage.getItem("token") && sessionStorage.getItem("role") === "guest");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const roomRequest = axios.get(isAuthenticated ? `${API}/ManageRooms` : `${API}/ManageRooms/public`, isAuthenticated ? authConfig() : undefined);
    const bookingsRequest = isAuthenticated
      ? axios.get(`${API}/ManageBookings/my-bookings`, authConfig())
      : Promise.resolve({ data: { bookings: [] } });
    Promise.all([roomRequest, bookingsRequest]).then(([roomResponse, bookingResponse]) => {
      if (!mounted) return;
      const roomData = roomResponse.data;
      setRooms(Array.isArray(roomData) ? roomData : roomData?.rooms || roomData?.data || []);
      setBookings(bookingResponse.data?.bookings || []);
    }).catch((requestError) => {
      if (mounted) setError(requestError.response?.data?.message || "We could not load your stay details right now.");
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const availableRooms = rooms.filter((room) => String(room.status).toLowerCase() === "available" && room.isActive !== false);
  const activeBookings = bookings.filter((booking) => ["confirmed", "checked-in"].includes(booking.status));
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt || b.checkInDate) - new Date(a.createdAt || a.checkInDate)).slice(0, 3);

  return (
    <GuestShell>
      <section className="guest-hero">
        <div className="guest-hero-copy">
          <span className="guest-eyebrow"><Sparkles size={13} /> YOUR ATLANTIS JOURNAL</span>
          <h1>A little room<br />to <em>unwind.</em></h1>
          <p>{isAuthenticated ? "Keep your stays, details and thoughtful extras together in one place." : "Explore our rooms and discover a stay that feels right for you."}</p>
          <a className="guest-primary-button" href="#rooms">{isAuthenticated ? "Explore available rooms" : "Browse available rooms"} <ArrowRight size={16} /></a>
        </div>
        <div className="guest-hero-art" role="img" aria-label="A calm, sunlit hotel terrace">
          <span className="guest-hero-stamp">A slower<br />kind of stay</span>
          <span className="guest-hero-caption"><MapPin size={13} /> KARACHI, PAKISTAN</span>
        </div>
      </section>

      {error && <div className="guest-alert" role="alert">{error}</div>}

      {isAuthenticated ? <section className="guest-stat-grid" aria-label="Your account summary">
        <article className="guest-stat-card guest-stat-green">
          <span className="guest-stat-icon"><CalendarDays size={18} /></span>
          <span className="guest-stat-label">UPCOMING &amp; IN-HOUSE</span>
          <strong>{loading ? "—" : activeBookings.length.toString().padStart(2, "0")}</strong>
          <small>active reservations</small>
        </article>
        <article className="guest-stat-card guest-stat-light">
          <span className="guest-stat-icon"><ReceiptText size={18} /></span>
          <span className="guest-stat-label">TOTAL STAYS</span>
          <strong>{loading ? "—" : bookings.length.toString().padStart(2, "0")}</strong>
          <small>your booking history</small>
        </article>
        <article className="guest-stat-card guest-stat-coral">
          <span className="guest-stat-icon"><ConciergeBell size={18} /></span>
          <span className="guest-stat-label">ROOMS TO DISCOVER</span>
          <strong>{loading ? "—" : availableRooms.length.toString().padStart(2, "0")}</strong>
          <small>ready for your next stay</small>
        </article>
      </section> : <section className="guest-stat-grid" aria-label="Hotel room summary">
        <article className="guest-stat-card guest-stat-green">
          <span className="guest-stat-icon"><ConciergeBell size={18} /></span>
          <span className="guest-stat-label">AVAILABLE ROOMS</span>
          <strong>{loading ? "—" : availableRooms.length.toString().padStart(2, "0")}</strong>
          <small>ready to welcome you</small>
        </article>
        <article className="guest-stat-card guest-stat-light">
          <span className="guest-stat-icon"><MapPin size={18} /></span>
          <span className="guest-stat-label">YOUR NEXT STAY</span>
          <strong>Atlantis</strong>
          <small>comfort and thoughtful service</small>
        </article>
        <article className="guest-stat-card guest-stat-coral">
          <span className="guest-stat-icon"><Sparkles size={18} /></span>
          <span className="guest-stat-label">ROOM TO UNWIND</span>
          <strong>Explore</strong>
          <small>find a room for your trip</small>
        </article>
      </section>}

      {isAuthenticated && <section className="guest-section guest-stays-section">
        <div className="guest-section-heading">
          <div><span className="guest-eyebrow">A LOOK BACK</span><h2>Recent stays</h2></div>
          <Link className="guest-text-link" to="/mybookings">Full booking history <ArrowRight size={15} /></Link>
        </div>
        {loading ? <div className="guest-empty-state">Gathering your stay details…</div> : recentBookings.length ? (
          <div className="guest-booking-list">
            {recentBookings.map((booking) => (
              <article className="guest-booking-row" key={booking._id}>
                <div className="guest-booking-date"><strong>{dateLabel(booking.checkInDate).split(" ")[0]}</strong><span>{dateLabel(booking.checkInDate).split(" ").slice(1).join(" ")}</span></div>
                <div className="guest-booking-details">
                  <strong>{booking.room?.roomType || "Room reservation"} <span>· Room {booking.room?.roomNumber || "—"}</span></strong>
                  <small>{dateLabel(booking.checkInDate)} <span>to</span> {dateLabel(booking.checkOutDate)}</small>
                </div>
                <span className={`guest-status guest-status-${booking.status || "pending"}`}>{(booking.status || "pending").replaceAll("-", " ")}</span>
                <Link className="guest-icon-link" to={`/invoice/${booking._id}`} aria-label={`View invoice for room ${booking.room?.roomNumber || "booking"}`} title="View invoice"><ReceiptText size={17} /></Link>
              </article>
            ))}
          </div>
        ) : <div className="guest-empty-state">Your first stay is still waiting. Browse the rooms below to get started.</div>}
      </section>}

      <section className="guest-section guest-rooms-section" id="rooms">
        <div className="guest-section-heading">
          <div><span className="guest-eyebrow">FIND YOUR PLACE</span><h2>Rooms to settle into</h2></div>
        </div>
        {loading ? <div className="guest-empty-state">Finding rooms…</div> : availableRooms.length ? (
          <div className="guest-room-grid">
            {availableRooms.slice(0, 4).map((room) => (
              <article className="guest-room-card" key={room._id || room.roomNumber}>
                <div className="guest-room-image">
                  {roomImage(room) ? <img src={roomImage(room)} alt={`${room.roomType || "Hotel"} room`} loading="lazy" /> : <span className="guest-image-placeholder">A</span>}
                  <span className="guest-room-type">{room.roomType || "Guest room"}</span>
                </div>
                <div className="guest-room-copy">
                  <div className="guest-room-title"><h3>Room {room.roomNumber || "—"}</h3><span>{room.capacity || 2} guests</span></div>
                  <p>{room.description || "A considered space to rest, reset, and make the most of your stay."}</p>
                  <div className="guest-room-bottom">
                    <strong>{money(room.pricePerNight)} <small>/ night</small></strong>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" className="border border-emerald-900 px-3 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50" onClick={() => navigate(`/rooms/${room._id}`)}>View details</button>
                      <button type="button" onClick={() => navigate(isAuthenticated ? `/booking/${room._id}` : "/login")}>{isAuthenticated ? "Choose room" : "Log in to book"} <ArrowRight size={14} /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="guest-empty-state">There are no available rooms at the moment. Please check back soon.</div>}
      </section>

      <section className="guest-service-banner">
        <div><span className="guest-eyebrow">HERE TO HELP</span><h2>Need something during your stay?</h2><p>Send a request to the front desk, contact the hotel, or share feedback at any time.</p></div>
        <div className="guest-help-actions">
          <button type="button" onClick={() => navigate(isAuthenticated ? "/guest-service-requests" : "/login")}>{isAuthenticated ? "Request a service" : "Log in to request a service"} <ArrowRight size={16} /></button>
          <button type="button" className="guest-help-secondary" onClick={() => navigate(isAuthenticated ? "/guest-contact" : "/login")}>Contact hotel <MessageCircle size={15} /></button>
          <button type="button" className="guest-help-secondary" onClick={() => navigate(isAuthenticated ? "/guest-feedback" : "/login")}>Share feedback <Star size={15} /></button>
        </div>
      </section>

      <footer className="guest-home-footer">
        <div className="guest-footer-feature">
          {availableRooms[0] ? (
            <>
              <div className="guest-footer-room-image">
                {roomImage(availableRooms[0])
                  ? <img src={roomImage(availableRooms[0])} alt={`${availableRooms[0].roomType || "Available"} room`} loading="lazy" />
                  : <span aria-hidden="true">A</span>}
              </div>
              <div className="guest-footer-room-copy">
                <span className="guest-footer-kicker"><Sparkles size={13} /> ROOM TO DISCOVER</span>
                <strong>{availableRooms[0].roomType || "Guest room"} · {money(availableRooms[0].pricePerNight)} / night</strong>
                <span>Room {availableRooms[0].roomNumber || "—"} · {availableRooms[0].capacity || 2} guests</span>
                <Link to={`/rooms/${availableRooms[0]._id}`}>Explore this room <ArrowRight size={14} /></Link>
              </div>
            </>
          ) : (
            <div className="guest-footer-room-copy">
              <span className="guest-footer-kicker"><Sparkles size={13} /> ROOMS TO DISCOVER</span>
              <strong>{loading ? "Finding your next stay…" : "No rooms available right now"}</strong>
              <span>{loading ? "We’re checking current availability." : "Please check again soon for updated availability."}</span>
              <a href="#rooms">Browse room availability <ArrowRight size={14} /></a>
            </div>
          )}
        </div>

        <div className="guest-footer-links">
          <div className="guest-footer-brand">
            <strong>ATLANTIS</strong>
            <span>Thoughtful stays, made easy.</span>
          </div>
          <nav aria-label="Helpful guest links">
            {!isAuthenticated && <Link to="/login"><UserRound size={15} /> Log in</Link>}
            {!isAuthenticated && <Link to="/signup"><ArrowRight size={15} /> Create account</Link>}
            <Link to="/mybookings"><CalendarDays size={15} /> My stays</Link>
            <Link to="/my-profile"><UserRound size={15} /> My profile</Link>
            <Link to="/guest-service-requests"><ConciergeBell size={15} /> Hotel services</Link>
            <Link to="/guest-contact"><MessageCircle size={15} /> Contact hotel</Link>
            <Link to="/guest-feedback"><Star size={15} /> Share feedback</Link>
            <Link to="/guest-privacy-policy"><ShieldCheck size={15} /> Privacy policy</Link>
          </nav>
          <p>For questions or suggestions, contact our team any time.</p>
        </div>
      </footer>
    </GuestShell>
  );
};
