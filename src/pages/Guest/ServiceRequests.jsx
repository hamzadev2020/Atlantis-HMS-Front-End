import { useEffect, useState } from "react";
import { CheckCircle2, ConciergeBell, RefreshCw, Send, Trash2 } from "lucide-react";
import axios from "axios";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";
import "./guest-pages.css";

const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
const serviceTypes = [
  ["room-service", "Room service"],
  ["wake-up-call", "Wake-up call"],
  ["transport", "Transport"],
  ["maintenance", "Maintenance"],
  ["complaint", "Something else"],
];
const requestTypeLabel = (type) => serviceTypes.find(([value]) => value === type)?.[1] || type;
const requestDateLabel = (date) => date
  ? new Date(date).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
  : "Just now";

export const ServiceRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [bookingId, setBookingId] = useState("");
  const [type, setType] = useState(serviceTypes[0][0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/ManageBookings/my-bookings`, authConfig()),
      axios.get(`${API}/ManageProfile/viewprofile`, authConfig()),
    ]).then(([bookingResponse, profileResponse]) => {
      const active = (bookingResponse.data?.bookings || []).filter((booking) => ["confirmed", "checked-in"].includes(booking.status));
      setBookings(active);
      setProfile(profileResponse.data);
      setBookingId(active[0]?._id || "");
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "We could not load your active reservations.");
    }).finally(() => setLoading(false));
  }, []);

  const refreshRequests = async () => {
    try {
      const response = await axios.get(`${API}/service-requests/my-requests`, authConfig());
      setRequests(response.data?.serviceRequests || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not load your request history.");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchRequests = () => axios.get(`${API}/service-requests/my-requests`, authConfig())
      .then((response) => {
        if (active) setRequests(response.data?.serviceRequests || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "We could not load your request history.");
      })
      .finally(() => {
        if (active) setRequestsLoading(false);
      });

    fetchRequests();
    const intervalId = window.setInterval(fetchRequests, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const submitRequest = async (event) => {
    event.preventDefault();
    const booking = bookings.find((item) => item._id === bookingId);
    if (!booking || !profile?._id) {
      setError("Choose an active reservation before sending a request.");
      return;
    }

    setSending(true);
    setError("");
    setSent(false);
    try {
      await axios.post(`${API}/service-requests`, {
        booking: booking._id,
        room: booking.room?._id || booking.room,
        type,
        description: description.trim(),
      }, authConfig());
      setSent(true);
      setDescription("");
      await refreshRequests();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your request could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const deleteRequest = async (request) => {
    if (!window.confirm("Delete this service request? This cannot be undone.")) return;
    setDeletingId(request._id);
    setError("");
    try {
      await axios.delete(`${API}/service-requests/${request._id}`, authConfig());
      setRequests((current) => current.filter((item) => item._id !== request._id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your request could not be deleted.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <GuestShell>
      <div className="guest-page-heading">
        <div><span className="guest-eyebrow">A HAND FROM THE FRONT DESK</span><h1>Request a service</h1><p>Send your request to our reception team during an active stay.</p></div>
      </div>
      {error && <div className="guest-alert" role="alert">{error}</div>}
      {sent && <div className="guest-alert success" role="status"><CheckCircle2 size={16} /> Your request was sent to reception. They’ll follow up with you at the hotel.</div>}
      {loading ? <div className="guest-empty-state">Loading your active stays…</div> : bookings.length ? (
        <div className="guest-form-layout">
          <section className="guest-form-panel">
            <h2>What can we help with?</h2>
            <p>Choose your room and tell us what you need. A receptionist will review it shortly.</p>
            <form className="guest-form" onSubmit={submitRequest}>
              <div className="guest-field">
                <label htmlFor="request-booking">Active reservation</label>
                <select id="request-booking" value={bookingId} onChange={(event) => setBookingId(event.target.value)} required>
                  {bookings.map((booking) => <option key={booking._id} value={booking._id}>Room {booking.room?.roomNumber || "—"} · {booking.room?.roomType || "Stay"}</option>)}
                </select>
              </div>
              <div className="guest-field">
                <label htmlFor="request-type">Request type</label>
                <select id="request-type" value={type} onChange={(event) => setType(event.target.value)}>
                  {serviceTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="guest-field">
                <label htmlFor="request-details">Details <span>(optional)</span></label>
                <textarea id="request-details" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} placeholder="Share any helpful details…" />
              </div>
              <button className="guest-action-button" type="submit" disabled={sending}>{sending ? "Sending…" : "Send to reception"} <Send size={14} /></button>
            </form>
          </section>
          <aside className="guest-info-panel">
            <ConciergeBell size={22} color="#d8f26a" />
            <h2>We’re right here.</h2>
            <p>Your request goes directly to the reception team. If it includes an extra charge, the team will add it to your stay and make the updated invoice available in your booking history.</p>
            <ul className="guest-info-list">
              <li><CheckCircle2 size={14} /> Requests are linked to your room and stay</li>
              <li><CheckCircle2 size={14} /> Reception can update you in person</li>
              <li><CheckCircle2 size={14} /> Any added charges appear on your invoice</li>
            </ul>
          </aside>
        </div>
      ) : <div className="guest-empty-state">Service requests are available during an active reservation. Book or check in to a room to contact reception here.</div>}

      <section className="guest-section">
        <div className="guest-section-heading">
          <div><span className="guest-eyebrow">FRONT DESK FOLLOW-UP</span><h2>Your request history</h2></div>
          <button className="guest-icon-link" type="button" onClick={refreshRequests} aria-label="Refresh request statuses" title="Refresh statuses"><RefreshCw size={16} /></button>
        </div>
        {requestsLoading ? <div className="guest-empty-state">Loading your requests…</div> : requests.length ? (
          <div className="guest-request-history">
            {requests.map((request) => (
              <article className="guest-request-history-card" key={request._id}>
                <div className="guest-request-history-main">
                  <div>
                    <h3>{requestTypeLabel(request.type)}</h3>
                    <p>{request.description || "No additional details"}</p>
                  </div>
                  <span className={`guest-status guest-status-${request.status || "pending"}`}>{(request.status || "pending").replaceAll("-", " ")}</span>
                </div>
                <div className="guest-request-history-meta">
                  <span>Room {request.room?.roomNumber || "—"}</span>
                  <span>Sent {requestDateLabel(request.createdAt)}</span>
                  {request.handledBy?.name && <span>Handled by {request.handledBy.name}</span>}
                  <button className="guest-icon-link" type="button" onClick={() => deleteRequest(request)} disabled={deletingId === request._id} aria-label={`Delete ${requestTypeLabel(request.type)} request`} title="Delete request">
                    <Trash2 size={15} /> {deletingId === request._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="guest-empty-state">Your requests to reception will appear here with their latest status.</div>}
      </section>
    </GuestShell>
  );
};