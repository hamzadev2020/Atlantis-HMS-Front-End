import { Navbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar } from "../../Components/Receptionist/Sidebar.jsx";

const defaultStats = [
  { label: "Total Tasks", value: "24" },
  { label: "Open Requests", value: "08" },
  { label: "Available Rooms", value: "16" },
  { label: "Guest Feedback", value: "12" },
];

export const ReceptionistModulePage = ({
  title = "Reception Desk",
  subtitle = "Daily operations overview",
  stats = defaultStats,
  highlights = [],
}) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                Front Office Module
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-800">{title}</h1>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-800">{item.value}</h2>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                <div className="mt-4 space-y-3">
                  {highlights.length ? (
                    highlights.map((item) => (
                      <div key={item} className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700">
                      View daily activity and team tasks from this panel.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800">Operational Notes</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>• Check all booked arrivals and check-outs for today.</li>
                  <li>• Review pending housekeeping tasks before the next shift.</li>
                  <li>• Track guest feedback and service requests in one place.</li>
                  <li>• Keep room availability updated for faster bookings.</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
