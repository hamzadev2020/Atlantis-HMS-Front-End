import { useState } from "react";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";
import { ProfilePictureControl } from "../../../Components/ProfilePictureControl.jsx";

export const AdminSetting = () => {
  const [hotelName, setHotelName] = useState("Atlantis The Royal");
  const [currency, setCurrency] = useState("PKR");
  const [checkInTime, setCheckInTime] = useState("2:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("12:00 PM");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("Settings saved successfully.");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
              <p className="text-gray-500 mt-1">Manage hotel configuration and booking rules</p>
            </div>

            <section className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-gray-800">Your profile</h2>
              <ProfilePictureControl accent="violet" showDetails />
            </section>

            {message && (
              <div className="mb-4 rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-violet-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hotel Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg border border-violet-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Rules</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition"
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
