import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar } from "../../Components/Receptionist/Sidebar.jsx";
const API = import.meta.env.VITE_API_URL;

const API_BASE = `${API}/ManageRooms`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const statusStyles = {
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-red-100 text-red-700",
  cleaning: "bg-amber-100 text-amber-700",
  maintenance: "bg-slate-200 text-slate-700",
  unavailable: "bg-gray-200 text-gray-700",
};

const typeStyles = {
  Standard: "bg-sky-100 text-sky-700",
  Deluxe: "bg-violet-100 text-violet-700",
  Suite: "bg-fuchsia-100 text-fuchsia-700",
  Executive: "bg-indigo-100 text-indigo-700",
};

export const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(API_BASE, getAuthHeaders());
      setRooms(Array.isArray(res.data.rooms) ? res.data.rooms : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    if (statusFilter === "all") return rooms;
    return rooms.filter((room) => room.status === statusFilter);
  }, [rooms, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: rooms.length,
      available: rooms.filter((room) => room.status === "available").length,
      occupied: rooms.filter((room) => room.status === "occupied").length,
      cleaning: rooms.filter((room) => room.status === "cleaning").length,
      maintenance: rooms.filter((room) => room.status === "maintenance").length,
    };
  }, [rooms]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Front Office</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-800">Room Availability</h1>
                <p className="mt-1 text-sm text-slate-500">View current room inventory and status across the hotel.</p>
              </div>

              <div className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                Total Rooms: {summary.total}
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Available</p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-600">{summary.available}</h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Occupied</p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">{summary.occupied}</h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Cleaning</p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">{summary.cleaning}</h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Maintenance</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-700">{summary.maintenance}</h2>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-0 focus:border-sky-500"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                Loading room inventory...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600 shadow-sm">
                {error}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                No rooms found for this status.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredRooms.map((room) => (
                  <div key={room._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                    <div className="h-36 bg-gradient-to-br from-sky-50 to-cyan-100 p-4">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[room.roomType] || "bg-slate-200 text-slate-700"}`}>
                          {room.roomType}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[room.status] || "bg-slate-200 text-slate-700"}`}>
                          {room.status}
                        </span>
                      </div>

                      <div className="mt-8 flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Room</p>
                          <h3 className="text-3xl font-bold text-slate-800">{room.roomNumber}</h3>
                        </div>
                        <div className="rounded-xl bg-white/80 px-2.5 py-1 text-sm font-semibold text-slate-700">
                          {room.capacity} guests
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                        <span>Price</span>
                        <span className="text-lg font-bold text-slate-800">$ {room.pricePerNight}</span>
                      </div>

                      <p className="mb-4 text-sm text-slate-600">
                        {room.description || "No description provided."}
                      </p>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        <span>{room.isActive ? "Active" : "Inactive"}</span>
                        <span className={room.isActive ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                          {room.isActive ? "Available" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoomAvailability;
