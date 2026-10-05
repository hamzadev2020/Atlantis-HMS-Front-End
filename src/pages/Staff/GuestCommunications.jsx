import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, MessageSquareText, Star } from "lucide-react";
import { Navbar as AdminNavbar } from "../../Components/Admin/Navbar.jsx";
import { Sidebar as AdminSidebar } from "../../Components/Admin/Sidebar.jsx";
import { Navbar as ManagerNavbar } from "../../Components/Manager/Navbar.jsx";
import { Sidebar as ManagerSidebar } from "../../Components/Manager/Sidebar.jsx";
import { Navbar as ReceptionistNavbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar as ReceptionistSidebar } from "../../Components/Receptionist/Sidebar.jsx";
import "../Guest/guest-contact-feedback.css";

const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}/guest-communications`;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});
const dateLabel = (date) => date
  ? new Date(date).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })
  : "Recently";
const labelStatus = (status = "open") => status.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const GuestCommunications = ({ type = "all" }) => {
  const role = sessionStorage.getItem("role");
  const Navbar = role === "admin" ? AdminNavbar : role === "manager" ? ManagerNavbar : ReceptionistNavbar;
  const Sidebar = role === "admin" ? AdminSidebar : role === "manager" ? ManagerSidebar : ReceptionistSidebar;
  const [communications, setCommunications] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const loadCommunications = () => axios.get(API, authConfig())
      .then((response) => {
        if (active) {
          setCommunications(response.data?.communications || []);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Guest messages could not be loaded.");
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

  const updateCommunication = async (item, values) => {
    setBusyId(item._id);
    setError("");
    setNotice("");
    try {
      const response = await axios.patch(`${API}/${item._id}`, values, authConfig());
      setCommunications((current) => current.map((communication) => (
        communication._id === item._id ? response.data.communication : communication
      )));
      setResponses((current) => ({ ...current, [item._id]: response.data.communication.staffResponse || "" }));
      setNotice("Guest communication updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The guest communication could not be updated.");
    } finally {
      setBusyId("");
    }
  };

  const filtered = useMemo(
    () => communications.filter((item) => type === "all" || item.type === type),
    [communications, type]
  );
  const openCount = filtered.filter((item) => ["open", "in-progress"].includes(item.status)).length;
  const respondedCount = filtered.filter((item) => ["responded", "closed"].includes(item.status)).length;
  const title = type === "contact" ? "Guest contact messages" : type === "feedback" ? "Guest feedback" : "Guest communications";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex min-h-[calc(100vh-70px)]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><span className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-700">GUEST RELATIONS</span><h1 className="mt-2 text-3xl font-bold text-slate-800">{title}</h1><p className="mt-1 text-sm text-slate-500">Review and respond to {type === "all" ? "guest messages and feedback" : type === "contact" ? "guest contact messages" : "guest feedback"}. This inbox refreshes every 15 seconds.</p></div>
            </header>

            {notice && <div className="mb-4 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status"><CheckCircle2 size={16} />{notice}</div>}
            {error && <div className="mb-4 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}

            <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Inbox summary">
              {[["Total submissions", filtered.length], ["Open follow-ups", openCount], ["Responded or closed", respondedCount]].map(([label, count]) => (
                <article key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><strong className="mt-1 block text-2xl text-slate-800">{loading ? "—" : count}</strong></article>
              ))}
            </section>

            {loading ? <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading guest messages…</div> : filtered.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filtered.map((item) => (
                  <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className={`contact-feedback-kind kind-${item.type}`}>{item.type === "contact" ? "Contact message" : "Feedback"} · {item.category}</span>
                        <h2 className="mt-1 text-xl font-semibold text-slate-800">{item.subject || "Guest feedback"}</h2>
                      </div>
                      <span className={`contact-feedback-status status-${item.status}`}>{labelStatus(item.status)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span><strong className="text-slate-700">Guest:</strong> {item.guest?.name || "Guest"}</span>
                      <span>{item.guest?.email}</span>
                      {item.phone && <span><strong className="text-slate-700">Phone:</strong> {item.phone}</span>}
                      <span>{dateLabel(item.createdAt)}</span>
                    </div>
                    {item.rating && <div className="mt-3 flex items-center gap-1 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: item.rating }, (_, index) => <Star key={index} size={15} fill="currentColor" />)}<span className="ml-1 text-xs text-slate-500">{item.rating} / 5</span></div>}
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.message}</p>

                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                      <label className="grid content-start gap-1 text-xs font-semibold text-slate-600">Status
                        <select className="min-h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm" value={item.status} disabled={busyId === item._id} onChange={(event) => updateCommunication(item, { status: event.target.value })}>
                          <option value="open">Open</option><option value="in-progress">In progress</option><option value="responded">Responded</option><option value="closed">Closed</option>
                        </select>
                      </label>
                      <form className="grid gap-2" onSubmit={(event) => { event.preventDefault(); updateCommunication(item, { staffResponse: responses[item._id] ?? item.staffResponse ?? "" }); }}>
                        <label className="grid gap-1 text-xs font-semibold text-slate-600">Response for guest
                          <textarea className="min-h-20 rounded-lg border border-slate-200 bg-white p-2 text-sm font-normal" value={responses[item._id] ?? item.staffResponse ?? ""} onChange={(event) => setResponses((current) => ({ ...current, [item._id]: event.target.value }))} maxLength={2000} placeholder="Add a response the guest can see…" />
                        </label>
                        <button type="submit" disabled={busyId === item._id || !(responses[item._id] ?? item.staffResponse ?? "").trim()} className="justify-self-end rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                          {busyId === item._id ? "Saving…" : "Save response"}
                        </button>
                      </form>
                    </div>
                    {item.handledBy?.name && <p className="mt-2 text-xs text-slate-400">Last handled by {item.handledBy.name}</p>}
                  </article>
                ))}
              </div>
            ) : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500"><MessageSquareText className="mx-auto mb-2 text-slate-400" size={22} />No guest {type === "all" ? "messages or feedback" : type === "contact" ? "contact messages" : "feedback"} yet.</div>}
          </div>
        </main>
      </div>
    </div>
  );
};
