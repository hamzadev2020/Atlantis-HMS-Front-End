import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, Mail, Search, ShieldCheck, UserRound } from "lucide-react";
import { Navbar as AdminNavbar } from "../../Components/Admin/Navbar.jsx";
import { Sidebar as AdminSidebar } from "../../Components/Admin/Sidebar.jsx";
import { Navbar as ReceptionistNavbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar as ReceptionistSidebar } from "../../Components/Receptionist/Sidebar.jsx";
const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}/ManageProfile/guests`;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});

const memberSince = (date) => date
  ? new Date(date).toLocaleDateString("en", { month: "long", year: "numeric" })
  : "Unknown";

export const GuestProfiles = () => {
  const role = sessionStorage.getItem("role");
  const Navbar = role === "admin" ? AdminNavbar : ReceptionistNavbar;
  const Sidebar = role === "admin" ? AdminSidebar : ReceptionistSidebar;
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingGuest, setUpdatingGuest] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get(API, authConfig())
      .then((response) => {
        if (active) {
          const profiles = response.data?.guests || [];
          setGuests(profiles);
          setSelectedId(profiles[0]?._id || "");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Guest profiles could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return guests;
    return guests.filter((guest) => (
      guest.name?.toLowerCase().includes(query) || guest.email?.toLowerCase().includes(query)
    ));
  }, [guests, search]);
  const selectedGuest = filteredGuests.find((guest) => guest._id === selectedId) || filteredGuests[0];

  const toggleGuestStatus = async () => {
    const isActive = selectedGuest?.isActive === false;
    if (!selectedGuest || (!isActive && !window.confirm(`Disable ${selectedGuest.name}'s guest account? They will be signed out and unable to sign in until re-enabled.`))) {
      return;
    }

    setUpdatingGuest(true);
    setError("");
    setNotice("");
    try {
      const response = await axios.patch(
        `${API_BASE}/ManageProfile/guests/${selectedGuest._id}/status`,
        { isActive },
        authConfig()
      );
      setGuests((current) => current.map((guest) => (
        guest._id === selectedGuest._id ? response.data.guest : guest
      )));
      setNotice(response.data.message || "Guest profile status updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Guest profile status could not be updated.");
    } finally {
      setUpdatingGuest(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex min-h-[calc(100vh-70px)]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.17em] text-sky-700">GUEST MANAGEMENT</span>
              <h1 className="mt-2 text-3xl font-bold text-slate-800">Guest profiles</h1>
              <p className="mt-1 text-sm text-slate-500">Search guest accounts and review their profile details.</p>
            </header>

            {error && <div className="mb-4 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}
            {notice && <div className="mb-4 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status"><CheckCircle2 size={16} />{notice}</div>}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-4">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-400">
                    <Search size={17} />
                    <span className="sr-only">Search guest profiles</span>
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search by guest name or email"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>
                </div>
                {loading ? (
                  <p className="p-8 text-center text-sm text-slate-500">Loading guest profiles…</p>
                ) : filteredGuests.length ? (
                  <ul className="max-h-[620px] divide-y divide-slate-100 overflow-y-auto">
                    {filteredGuests.map((guest) => (
                      <li key={guest._id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(guest._id)}
                          className={`flex w-full items-center gap-3 p-4 text-left transition ${
                            selectedGuest?._id === guest._id ? "bg-sky-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-100 font-bold text-sky-700">
                            {guest.profileImage ? <img src={guest.profileImage} alt="" className="h-full w-full rounded-full object-cover" /> : guest.name?.trim()?.charAt(0)?.toUpperCase() || "G"}
                          </span>
                          <span className="min-w-0 flex-1">
                            <strong className="block truncate text-sm text-slate-800">{guest.name}</strong>
                            <span className="block truncate text-xs text-slate-500">{guest.email}</span>
                          </span>
                          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            guest.isActive === false ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"
                          }`}>{guest.isActive === false ? "Inactive" : "Active"}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-8 text-center text-sm text-slate-500">{guests.length ? "No guests match your search." : "No guest profiles found."}</p>
                )}
              </section>

              <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Selected guest profile">
                {selectedGuest ? (
                  <>
                    <div className="mb-6 flex items-center gap-4">
                      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-2xl font-bold text-white">
                        {selectedGuest.profileImage ? <img src={selectedGuest.profileImage} alt="" className="h-full w-full rounded-2xl object-cover" /> : selectedGuest.name?.trim()?.charAt(0)?.toUpperCase() || "G"}
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold text-slate-800">{selectedGuest.name}</h2>
                        <p className="text-sm text-slate-500">Guest account</p>
                      </div>
                    </div>
                    <dl className="space-y-4">
                      <div className="flex gap-3">
                        <Mail size={17} className="mt-0.5 shrink-0 text-sky-600" />
                        <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email address</dt><dd className="break-all text-sm text-slate-700">{selectedGuest.email}</dd></div>
                      </div>
                      <div className="flex gap-3">
                        <UserRound size={17} className="mt-0.5 shrink-0 text-sky-600" />
                        <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account name</dt><dd className="text-sm text-slate-700">{selectedGuest.name}</dd></div>
                      </div>
                      <div className="flex gap-3">
                        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-sky-600" />
                        <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Member since</dt><dd className="text-sm text-slate-700">{memberSince(selectedGuest.createdAt)}</dd></div>
                      </div>
                    </dl>
                    {role === "admin" && (
                      <button
                        type="button"
                        onClick={toggleGuestStatus}
                        disabled={updatingGuest}
                        className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          selectedGuest.isActive === false
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {updatingGuest ? "Updating profile…" : selectedGuest.isActive === false ? "Enable guest profile" : "Disable guest profile"}
                      </button>
                    )}
                  </>
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">Select a guest to view their profile.</p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
