import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar } from "../../Components/Receptionist/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const ReceptionistAnalytics = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const headers = getAuthHeaders();

        const [roomsRes, bookingsRes, tasksRes, serviceRes] = await Promise.all([
          axios.get(`${API_BASE}/api/ManageRooms`, headers),
          axios.get(`${API_BASE}/api/ManageBookings`, headers),
          axios.get(`${API_BASE}/api/housekeeping-tasks`, headers),
          axios.get(`${API_BASE}/api/service-requests`, headers),
        ]);

        if (!active) return;
        setRooms(Array.isArray(roomsRes.data.rooms) ? roomsRes.data.rooms : []);
        setBookings(Array.isArray(bookingsRes.data.bookings) ? bookingsRes.data.bookings : []);
        setTasks(Array.isArray(tasksRes.data.tasks) ? tasksRes.data.tasks : []);
        setServiceRequests(Array.isArray(serviceRes.data.serviceRequests) ? serviceRes.data.serviceRequests : []);
        setError("");
      } catch (err) {
        if (active) setError(err?.response?.data?.message || "Unable to load analytics data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalytics();
    const intervalId = window.setInterval(fetchAnalytics, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const todayDate = new Date().toLocaleDateString("en-CA");

  const analytics = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.status === "available").length;
    const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
    const cleaningRooms = rooms.filter((room) => room.status === "cleaning").length;

    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const checkedIn = bookings.filter((b) => b.status === "checked-in").length;
    const checkedOut = bookings.filter((b) => b.status === "checked-out").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    const checkInsToday = bookings.filter((b) => {
      const inDate = b.checkInDate ? new Date(b.checkInDate).toLocaleDateString("en-CA") : null;
      return b.status === "confirmed" && inDate === todayDate;
    }).length;

    const checkOutsToday = bookings.filter((b) => {
      const outDate = b.checkOutDate ? new Date(b.checkOutDate).toLocaleDateString("en-CA") : null;
      return b.status === "checked-in" && outDate === todayDate;
    }).length;

    const avgNights = bookings.length
      ? bookings.reduce((sum, booking) => sum + Number(booking.totalNights || 0), 0) / bookings.length
      : 0;

    const pendingTasks = tasks.filter((task) => task.status !== "completed").length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;

    const pendingServiceRequests = serviceRequests.filter((item) => item.status !== "resolved" && item.status !== "completed").length;
    const resolvedServiceRequests = serviceRequests.filter((item) => item.status === "resolved" || item.status === "completed").length;

    const bookingSourceCounts = [
      { label: "Online", value: bookings.filter((b) => b.bookingSource === "online").length },
      { label: "Walk-in", value: bookings.filter((b) => b.bookingSource === "walk-in").length },
      { label: "Phone", value: bookings.filter((b) => b.bookingSource === "phone").length },
    ];

    const roomStatusCounts = [
      { label: "Available", value: availableRooms },
      { label: "Occupied", value: occupiedRooms },
      { label: "Cleaning", value: cleaningRooms },
      { label: "Maintenance", value: rooms.filter((room) => room.status === "maintenance").length },
    ];

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      confirmed,
      checkedIn,
      checkedOut,
      cancelled,
      checkInsToday,
      checkOutsToday,
      avgNights,
      pendingTasks,
      completedTasks,
      pendingServiceRequests,
      resolvedServiceRequests,
      bookingSourceCounts,
      roomStatusCounts,
    };
  }, [rooms, bookings, tasks, serviceRequests, todayDate]);

  const statCards = [
    { label: "Total Rooms", value: analytics.totalRooms, tone: "sky" },
    { label: "Available Rooms", value: analytics.availableRooms, tone: "emerald" },
    { label: "Checked-in Guests", value: analytics.checkedIn, tone: "violet" },
    { label: "Check-ins Today", value: analytics.checkInsToday, tone: "amber" },
    { label: "Check-outs Today", value: analytics.checkOutsToday, tone: "rose" },
    { label: "Avg Stay Nights", value: analytics.avgNights.toFixed(1), tone: "cyan" },
    { label: "Pending Tasks", value: analytics.pendingTasks, tone: "indigo" },
    { label: "Open Requests", value: analytics.pendingServiceRequests, tone: "orange" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Front Office Analytics</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-800">Reception Analytics</h1>
              <p className="mt-2 text-sm text-slate-600">
                Live metrics pulled from bookings, room inventory, housekeeping, and service requests.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Loading analytics data...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 shadow-sm">
                {error}
              </div>
            ) : (
              <>
                <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <h2 className="mt-2 text-3xl font-bold text-slate-800">{card.value}</h2>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800">Booking Pipeline</h3>
                    <div className="mt-5 space-y-4">
                      {[
                        { label: "Confirmed", value: analytics.confirmed },
                        { label: "Checked In", value: analytics.checkedIn },
                        { label: "Checked Out", value: analytics.checkedOut },
                        { label: "Cancelled", value: analytics.cancelled },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                            <span>{item.label}</span>
                            <span className="font-semibold text-slate-800">{item.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-sky-500"
                              style={{ width: `${Math.max((item.value / Math.max(bookings.length, 1)) * 100, 8)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800">Room Status</h3>
                    <div className="mt-5 space-y-4">
                      {analytics.roomStatusCounts.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                            <span>{item.label}</span>
                            <span className="font-semibold text-slate-800">{item.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.max((item.value / Math.max(analytics.totalRooms, 1)) * 100, 8)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800">Booking Source Mix</h3>
                    <div className="mt-5 space-y-3">
                      {analytics.bookingSourceCounts.map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                          <span className="text-sm font-medium text-slate-600">{item.label}</span>
                          <span className="text-base font-bold text-slate-800">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800">Operational Health</h3>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-xl bg-violet-50 p-4">
                        <p className="text-sm text-violet-700">Housekeeping</p>
                        <p className="mt-2 text-2xl font-bold text-violet-900">{analytics.pendingTasks}</p>
                        <p className="text-sm text-violet-700">pending / {analytics.completedTasks} completed</p>
                      </div>

                      <div className="rounded-xl bg-orange-50 p-4">
                        <p className="text-sm text-orange-700">Service Requests</p>
                        <p className="mt-2 text-2xl font-bold text-orange-900">{analytics.pendingServiceRequests}</p>
                        <p className="text-sm text-orange-700">open / {analytics.resolvedServiceRequests} resolved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
