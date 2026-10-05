import { useState } from "react";
import { Navbar } from "../../Components/Manager/Navbar.jsx";
import { Sidebar } from "../../Components/Manager/Sidebar.jsx";
import { ProfilePictureControl } from "../../Components/ProfilePictureControl.jsx";

export const ManagerSettings = () => {
  const [hotelName, setHotelName] = useState("Atlantis The Royal");
  const [currency, setCurrency] = useState("PKR");
  const [checkInTime, setCheckInTime] = useState("2:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("12:00 PM");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("Manager settings saved successfully.");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Manager Settings</h1>
              <p className="mt-1 text-gray-500">
                Manage hotel configuration and booking preferences for your team.
              </p>
            </div>

            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-gray-800">Your profile</h2>
              <ProfilePictureControl accent="emerald" showDetails />
            </section>

            {message && (
              <div className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Hotel Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Booking Rules</h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-600">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
