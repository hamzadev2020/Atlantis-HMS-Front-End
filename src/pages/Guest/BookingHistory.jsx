import { useEffect, useState } from "react";
import { CalendarDays, ReceiptText, XCircle } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";
import "./guest-pages.css";
const API_BASE = import.meta.env.VITE_API_URL;


const API = `${API_BASE}/ManageBookings`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const money = (value) => new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const roomImage = (room) => Array.isArray(room?.images) ? room.images[0] : room?.images;

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${API}/my-bookings`, authConfig()).then((response) => {
      if (active) setBookings(response.data?.bookings || []);
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "We could not load your booking history.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await axios.post(`${API}/cencelbooking/${bookingId}`, {}, authConfig());
      setBookings((current) => current.map((booking) => booking._id === bookingId ? { ...booking, status: "cancelled" } : booking));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This booking could not be cancelled.");
    }
  };

  return (
    <GuestShell>
      <div className="guest-page-heading">
        <div><span className="guest-eyebrow">YOUR ATLANTIS JOURNAL</span><h1>Booking history</h1><p>Every stay, all in one place. Your invoices are available with each reservation.</p></div>
        <span className="guest-profile-role">{bookings.length} {bookings.length === 1 ? "stay" : "stays"}</span>
      </div>
      {error && <div className="guest-alert" role="alert">{error}</div>}
      {loading ? <div className="guest-empty-state">Loading your reservations…</div> : bookings.length ? (
        <div className="guest-history-list">
          {bookings.map((booking) => (
            <article className="guest-history-card" key={booking._id}>
              <div className="guest-history-image">
                {roomImage(booking.room) ? <img src={roomImage(booking.room)} alt={`${booking.room?.roomType || "Hotel"} room`} loading="lazy" /> : "A"}
              </div>
              <div className="guest-history-body">
                <div className="guest-history-title">
                  <h2>{booking.room?.roomType || "Room reservation"}</h2>
                  <p>Room {booking.room?.roomNumber || "—"} · <span className={`guest-status guest-status-${booking.status || "pending"}`}>{(booking.status || "pending").replaceAll("-", " ")}</span></p>
                </div>
                <div className="guest-history-meta">
                  <div><strong>Check-in</strong>{dateLabel(booking.checkInDate)}</div>
                  <div><strong>Check-out</strong>{dateLabel(booking.checkOutDate)}</div>
                  <div><strong>Duration</strong>{booking.totalNights || 0} nights</div>
                  <div><strong>Total</strong>{money(booking.totalAmount)}</div>
                </div>
                <div className="guest-history-actions">
                  <Link className="guest-action-button" to={`/invoice/${booking._id}`}><ReceiptText size={15} /> View invoice</Link>
                  {booking.status === "confirmed" && <button className="guest-action-button danger" type="button" onClick={() => cancelBooking(booking._id)}><XCircle size={15} /> Cancel reservation</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="guest-empty-state"><CalendarDays size={19} /> No stays yet. Your reservations will appear here after booking a room.</div>
      )}
    </GuestShell>
  );
};