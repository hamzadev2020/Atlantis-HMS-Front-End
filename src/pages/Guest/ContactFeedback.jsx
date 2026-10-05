import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Send, Star } from "lucide-react";
import axios from "axios";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";
import "./guest-contact-feedback.css";

const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}/guest-communications`;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});
const categories = ["General", "Booking", "Room", "Service", "Staff", "Billing", "Cleanliness", "Other"];
const labelStatus = (status = "open") => status.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (date) => date
  ? new Date(date).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })
  : "Recently";

export const ContactFeedback = ({ type = "all" }) => {
  const [contact, setContact] = useState({ category: "General", subject: "", phone: "", message: "" });
  const [feedback, setFeedback] = useState({ category: "Service", rating: 5, message: "" });
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const history = communications.filter((item) => type === "all" || item.type === type);

  useEffect(() => {
    let active = true;
    const loadCommunications = () => axios.get(`${API}/mine`, authConfig())
      .then((response) => {
        if (active) {
          setCommunications(response.data?.communications || []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Your messages could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    loadCommunications();
    const intervalId = window.setInterval(loadCommunications, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const submit = async (event, type) => {
    event.preventDefault();
    const form = type === "contact" ? contact : feedback;
    setSending(type);
    setError("");
    setNotice("");
    try {
      await axios.post(API, { ...form, type }, authConfig());
      if (type === "contact") {
        setContact({ category: "General", subject: "", phone: "", message: "" });
      } else {
        setFeedback({ category: "Service", rating: 5, message: "" });
      }
      const response = await axios.get(`${API}/mine`, authConfig());
      setCommunications(response.data?.communications || []);
      setNotice(type === "contact" ? "Your message has been sent to the hotel team." : "Thank you. Your feedback has been shared with the hotel team.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your submission could not be sent.");
    } finally {
      setSending("");
    }
  };

  return (
    <GuestShell>
      <header className="guest-page-heading">
        <div><span className="guest-eyebrow">{type === "feedback" ? "HELP US IMPROVE" : "WE’RE HERE TO HELP"}</span><h1>{type === "feedback" ? "Share feedback" : type === "contact" ? "Contact the hotel" : "Contact & feedback"}</h1><p>{type === "feedback" ? "Tell us about your stay and help us improve the guest experience." : type === "contact" ? "Ask a question or let our hotel team know what you need." : "Contact our team during your stay or tell us how we did. Your messages are shared with hotel management."}</p></div>
      </header>

      {error && <div className="guest-alert" role="alert">{error}</div>}
      {notice && <div className="guest-alert success" role="status"><CheckCircle2 size={16} />{notice}</div>}

      <div className={`contact-feedback-grid${type === "all" ? "" : " contact-feedback-single"}`}>
        {(type === "all" || type === "contact") && <section className="contact-feedback-panel">
          <div className="contact-feedback-heading"><span><MessageCircle size={19} /></span><div><h2>Contact the hotel</h2><p>Ask a question or let us know what you need.</p></div></div>
          <form className="contact-feedback-form" onSubmit={(event) => submit(event, "contact")}>
            <label>Topic<select value={contact.category} onChange={(event) => setContact((current) => ({ ...current, category: event.target.value }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Subject<input value={contact.subject} onChange={(event) => setContact((current) => ({ ...current, subject: event.target.value }))} maxLength={160} required placeholder="What can we help with?" /></label>
            <label>Phone number <span>(optional)</span><input type="tel" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} maxLength={40} placeholder="A number where we can reach you" /></label>
            <label>Message<textarea value={contact.message} onChange={(event) => setContact((current) => ({ ...current, message: event.target.value }))} maxLength={2000} required rows={5} placeholder="Write your message…" /></label>
            <button type="submit" disabled={sending === "contact"}>{sending === "contact" ? "Sending…" : "Send message"}<Send size={15} /></button>
          </form>
        </section>}

        {(type === "all" || type === "feedback") && <section className="contact-feedback-panel feedback-panel">
          <div className="contact-feedback-heading"><span><Star size={19} /></span><div><h2>Share feedback</h2><p>Your feedback helps us improve every stay.</p></div></div>
          <form className="contact-feedback-form" onSubmit={(event) => submit(event, "feedback")}>
            <label>What is your feedback about?<select value={feedback.category} onChange={(event) => setFeedback((current) => ({ ...current, category: event.target.value }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <fieldset className="feedback-rating">
              <legend>Your rating</legend>
              <div>{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" aria-label={`${rating} star${rating > 1 ? "s" : ""}`} aria-pressed={feedback.rating === rating} onClick={() => setFeedback((current) => ({ ...current, rating }))}><Star size={23} fill={rating <= feedback.rating ? "currentColor" : "none"} /></button>)}</div>
              <span>{feedback.rating} out of 5</span>
            </fieldset>
            <label>Your feedback<textarea value={feedback.message} onChange={(event) => setFeedback((current) => ({ ...current, message: event.target.value }))} maxLength={2000} required rows={5} placeholder="Tell us what went well or what we could do better…" /></label>
            <button type="submit" disabled={sending === "feedback"}>{sending === "feedback" ? "Sending…" : "Send feedback"}<Send size={15} /></button>
          </form>
        </section>}
      </div>

      <section className="guest-section">
        <div className="guest-section-heading"><div><span className="guest-eyebrow">YOUR {type === "feedback" ? "FEEDBACK" : type === "contact" ? "CONTACT MESSAGES" : "MESSAGES"}</span><h2>{type === "feedback" ? "Feedback history" : type === "contact" ? "Contact history" : "Contact & feedback history"}</h2></div></div>
        {loading ? <div className="guest-empty-state">Loading your messages…</div> : history.length ? (
          <div className="contact-feedback-history">
            {history.map((item) => (
              <article className="contact-feedback-history-card" key={item._id}>
                <div className="contact-feedback-history-top">
                  <div><span className={`contact-feedback-kind kind-${item.type}`}>{item.type === "contact" ? "Contact message" : "Feedback"} · {item.category}</span><h3>{item.subject || `${item.rating} / 5 rating`}</h3></div>
                  <span className={`contact-feedback-status status-${item.status}`}>{labelStatus(item.status)}</span>
                </div>
                <p>{item.message}</p>
                <div className="contact-feedback-history-meta"><span>Sent {dateLabel(item.createdAt)}</span>{item.handledBy?.name && <span>Handled by {item.handledBy.name}</span>}</div>
                {item.staffResponse && <div className="contact-feedback-response"><strong>Hotel team response</strong><p>{item.staffResponse}</p></div>}
              </article>
            ))}
          </div>
        ) : <div className="guest-empty-state">{type === "feedback" ? "Feedback you send will appear here with its latest status." : type === "contact" ? "Messages you send will appear here with their latest status." : "Messages and feedback you send will appear here with their latest status."}</div>}
      </section>
    </GuestShell>
  );
};
