import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Manager/Navbar.jsx";
import { Sidebar } from "../../Components/Manager/Sidebar.jsx";
import { DashboardBarChart, DashboardKpiCard } from "../../Components/DashboardInsights.jsx";
const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}`;
const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});
const dateLabel = (value) => value
  ? new Date(value).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })
  : "Recently";

export const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ rooms: [], bookings: [], requests: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        const config = getAuthConfig();
        const [roomsRes, bookingsRes, requestsRes, tasksRes] = await Promise.all([
          axios.get(`${API}/ManageRooms`, config),
          axios.get(`${API}/ManageBookings`, config),
          axios.get(`${API}/service-requests`, config),
          axios.get(`${API}/housekeeping-tasks`, config),
        ]);
        if (!active) return;
        setData({
          rooms: roomsRes.data?.rooms || [],
          bookings: bookingsRes.data?.bookings || [],
          requests: requestsRes.data?.serviceRequests || [],
          tasks: tasksRes.data?.tasks || [],
        });
        setError("");
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || "Dashboard data could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();
    const intervalId = window.setInterval(loadDashboard, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const stats = [
    { label: "Total Rooms", value: data.rooms.length, tone: "bg-emerald-600" },
    { label: "Available", value: data.rooms.filter((room) => room.status === "available").length, tone: "bg-teal-500" },
    { label: "Occupied", value: data.rooms.filter((room) => room.status === "occupied").length, tone: "bg-amber-500" },
    { label: "Open Service Requests", value: data.requests.filter((request) => !["resolved", "completed"].includes(request.status)).length, tone: "bg-sky-500" },
  ];
  const occupancyRate = data.rooms.length
    ? Math.round((data.rooms.filter((room) => room.status === "occupied").length / data.rooms.length) * 100)
    : 0;
  const taskCompletionRate = data.tasks.length
    ? Math.round((data.tasks.filter((task) => task.status === "completed").length / data.tasks.length) * 100)
    : 0;
  const requestResolutionRate = data.requests.length
    ? Math.round((data.requests.filter((request) => ["resolved", "completed"].includes(request.status)).length / data.requests.length) * 100)
    : 0;
  const roomStatusChart = [
    { label: "Available", value: data.rooms.filter((room) => room.status === "available").length, color: "#14b8a6" },
    { label: "Occupied", value: data.rooms.filter((room) => room.status === "occupied").length, color: "#f59e0b" },
    { label: "Cleaning", value: data.rooms.filter((room) => room.status === "cleaning").length, color: "#8b5cf6" },
    { label: "Maintenance", value: data.rooms.filter((room) => room.status === "maintenance").length, color: "#ef4444" },
    { label: "Unavailable", value: data.rooms.filter((room) => room.status === "unavailable").length, color: "#64748b" },
  ];
  const bookingStatusChart = [
    { label: "Confirmed", value: data.bookings.filter((booking) => booking.status === "confirmed").length },
    { label: "Checked in", value: data.bookings.filter((booking) => booking.status === "checked-in").length },
    { label: "Checked out", value: data.bookings.filter((booking) => booking.status === "checked-out").length },
    { label: "Cancelled", value: data.bookings.filter((booking) => booking.status === "cancelled").length },
  ];
  const operationsChart = [
    { label: "Tasks pending", value: data.tasks.filter((task) => task.status === "pending").length, color: "#f59e0b" },
    { label: "Tasks in progress", value: data.tasks.filter((task) => task.status === "in-progress").length, color: "#3b82f6" },
    { label: "Tasks completed", value: data.tasks.filter((task) => task.status === "completed").length, color: "#10b981" },
    { label: "Requests open", value: data.requests.filter((request) => !["resolved", "completed"].includes(request.status)).length, color: "#f97316" },
  ];

  const quickActions = [
    { title: "Manage Staff", description: "View and update staff records", path: "/Manage-Staff" },
    { title: "Manage Rooms", description: "Review room inventory and availability", path: "/manager-rooms" },
    { title: "Service Requests", description: "Track guest requests and reception updates", path: "/Manager-Service-View" },
    { title: "Housekeeping Tasks", description: "Monitor assignments and task completion", path: "/manager-housekeeping" },
  ];

  const recentActivity = useMemo(() => {
    const requests = data.requests.map((request) => ({
      id: `request-${request._id}`,
      title: `${request.type?.replaceAll("-", " ") || "Service"} request · ${request.status || "pending"}`,
      detail: `Room ${request.room?.roomNumber || "—"}${request.guest?.name ? ` · ${request.guest.name}` : ""}${request.description ? ` · ${request.description}` : ""}`,
      date: request.updatedAt || request.createdAt,
    }));
    const tasks = data.tasks.map((task) => ({
      id: `task-${task._id}`,
      title: `${task.taskType || "Room"} task · ${task.status || "pending"}`,
      detail: `Room ${task.room?.roomNumber || "—"}${task.assignedTo?.name ? ` · ${task.assignedTo.name}` : ""}`,
      date: task.updatedAt || task.createdAt,
    }));

    return [...requests, ...tasks]
      .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0))
      .slice(0, 5);
  }, [data]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
              <p className="mt-1 text-gray-500">Live overview of hotel operations and team performance. Updates every 15 seconds.</p>
            </div>

            {error && <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <h2 className="mt-2 text-3xl font-bold text-gray-800">{loading ? "—" : stat.value}</h2>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone} text-lg font-bold text-white`}>{loading ? "…" : stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Bookings", data.bookings.length, "/Manager-View-Bookings"],
                ["Tasks In Progress", data.tasks.filter((task) => task.status === "in-progress").length, "/manager-housekeeping"],
                ["Completed Tasks", data.tasks.filter((task) => task.status === "completed").length, "/manager-housekeeping"],
              ].map(([label, value, path]) => (
                <button key={label} type="button" onClick={() => navigate(path)} className="rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="text-sm text-gray-500">{label}</span>
                  <strong className="mt-1 block text-2xl text-gray-800">{loading ? "—" : value}</strong>
                </button>
              ))}
            </div>

            <section className="mb-8" aria-label="Manager key performance indicators">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-800">Key performance indicators</h2>
                <p className="text-xs text-gray-500">Calculated from current hotel records</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <DashboardKpiCard label="Room occupancy" value={loading ? "—" : `${occupancyRate}%`} detail={`${data.rooms.filter((room) => room.status === "occupied").length} of ${data.rooms.length} rooms occupied`} color="#f59e0b" />
                <DashboardKpiCard label="Task completion" value={loading ? "—" : `${taskCompletionRate}%`} detail={`${data.tasks.filter((task) => task.status === "completed").length} of ${data.tasks.length} tasks completed`} color="#10b981" />
                <DashboardKpiCard label="Requests resolved" value={loading ? "—" : `${requestResolutionRate}%`} detail={`${data.requests.filter((request) => ["resolved", "completed"].includes(request.status)).length} of ${data.requests.length} requests resolved`} color="#0ea5e9" />
              </div>
            </section>

            <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2" aria-label="Manager charts">
              <DashboardBarChart title="Room status" subtitle="Live distribution across room inventory" items={roomStatusChart} loading={loading} accent="#059669" />
              <DashboardBarChart title="Booking pipeline" subtitle={`${data.bookings.length} total bookings by current status`} items={bookingStatusChart} loading={loading} accent="#059669" />
              <DashboardBarChart title="Operations overview" subtitle="Housekeeping progress and service requests needing attention" items={operationsChart} loading={loading} accent="#059669" />
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                  <span className="text-sm font-semibold text-emerald-600">Operations</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {quickActions.map((action) => (
                    <div key={action.title} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition hover:shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">{action.title}</h4>
                      <p className="mt-2 text-sm text-gray-600">{action.description}</p>
                      <button type="button" onClick={() => navigate(action.path)} className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Open</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Recent Activity</h3>
                {loading ? <p className="text-sm text-gray-500">Loading activity…</p> : recentActivity.length ? (
                  <div className="space-y-4">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="border-l-4 border-emerald-500 pl-4">
                        <p className="font-semibold capitalize text-gray-800">{item.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
                        <span className="mt-2 block text-xs text-gray-400">{dateLabel(item.date)}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No recent operational activity.</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
