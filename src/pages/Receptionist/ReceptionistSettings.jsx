import { useState } from "react";
import { BellRing, CheckCircle2, Clock3, Hotel, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar } from "../../Components/Receptionist/Sidebar.jsx";
import { ProfilePictureControl } from "../../Components/ProfilePictureControl.jsx";

export const ReceptionistSettings = () => {
  const [settings, setSettings] = useState({
    deskName: "Front Office Desk",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    currency: "PKR",
    autoAssign: true,
    guestSms: true,
    vipAlert: true,
    housekeepingAlert: false,
    serviceEscalation: true,
  });

  const [message, setMessage] = useState("");

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setMessage("Reception desk settings saved successfully.");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Desk Configuration</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">Reception Settings</h1>
              </div>
              <button
                onClick={handleSave}
                className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Save Settings
              </button>
            </div>

            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-slate-800">Your profile</h2>
              <ProfilePictureControl showDetails />
            </section>

            {message && (
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 size={16} />
                {message}
              </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                      <Hotel size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Desk Profile</h2>
                      <p className="text-sm text-slate-500">Basic front office configuration</p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">Desk Name</label>
                      <input
                        type="text"
                        value={settings.deskName}
                        onChange={(e) => updateSetting("deskName", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting("currency", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                      >
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">Check-in Time</label>
                      <input
                        type="time"
                        value={settings.checkInTime}
                        onChange={(e) => updateSetting("checkInTime", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-600">Check-out Time</label>
                      <input
                        type="time"
                        value={settings.checkOutTime}
                        onChange={(e) => updateSetting("checkOutTime", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                      <BellRing size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Notifications & Alerts</h2>
                      <p className="text-sm text-slate-500">Control front-desk communication rules</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      ["guestSms", "Guest SMS reminders"],
                      ["vipAlert", "VIP guest alerts"],
                      ["housekeepingAlert", "Housekeeping alerts"],
                      ["serviceEscalation", "Service escalation notifications"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                        <button
                          type="button"
                          onClick={() => updateSetting(key, !settings[key])}
                          className={`relative h-7 w-12 rounded-full transition ${settings[key] ? "bg-sky-600" : "bg-slate-300"}`}
                          aria-label={label}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${settings[key] ? "left-6" : "left-1"}`}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Workflow</h2>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-semibold text-slate-800">Auto assignment</p>
                      <p className="mt-1">Automatically route guest requests to the relevant desk agent.</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-semibold text-slate-800">Service SLA</p>
                      <p className="mt-1">Target response time for standard guest services is under 18 minutes.</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Access Control</h2>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span>Role-based access</span>
                      <span className="font-semibold text-emerald-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span>Desk session timeout</span>
                      <span className="font-semibold text-slate-700">30 min</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <span>Audit tracking</span>
                      <span className="font-semibold text-sky-600">Active</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-600 to-cyan-500 p-5 text-white shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-white/15 p-2">
                      <Sparkles size={18} />
                    </div>
                    <h2 className="text-lg font-bold">Front Desk Summary</h2>
                  </div>
                  <p className="text-sm text-sky-50">
                    Current desk status is active and ready for guest check-ins, room assignment, and service follow-up.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
