import { useEffect, useId, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../Components/Admin/Sidebar.jsx";
import { DashboardBarChart, DashboardKpiCard } from "../../Components/DashboardInsights.jsx";

const API = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
const LOGIN_PATH = "/login"; // <-- apne login route ke mutabiq change karein
const REFRESH_MS = 15000;
const RANGES = [7, 14, 30];
const TYPE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#64748b"];
const DONE = ["resolved", "completed", "closed"];

const ENDPOINTS = [
  { key: "rooms", label: "Rooms", path: "/ManageRooms", pick: (d) => d?.rooms },
  { key: "bookings", label: "Bookings", path: "/ManageBookings", pick: (d) => d?.bookings },
  { key: "staff", label: "Staff", path: "/user/staffs", pick: (d) => d?.staffs },
  { key: "requests", label: "Service requests", path: "/service-requests", pick: (d) => d?.serviceRequests },
  { key: "tasks", label: "Housekeeping tasks", path: "/housekeeping-tasks", pick: (d) => d?.tasks },
];

const norm = (value) => String(value || "").toLowerCase();
const countStatus = (list, ...statuses) => list.filter((item) => statuses.includes(norm(item.status))).length;
const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);
const dateLabel = (value) => (value
  ? new Date(value).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })
  : "Recently");
const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const money = (value) => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
const bookingAmount = (booking) => Number(booking.totalAmount ?? booking.totalPrice ?? booking.totalCost ?? booking.amount ?? 0) || 0;

/* ================= Charts (pure SVG, no extra library) ================= */

const Card = ({ title, subtitle, right, className = "", children }) => (
  <div className={`rounded-2xl border border-purple-100 bg-white p-5 shadow-lg ${className}`}>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </div>
);

const Skeleton = () => <div className="h-52 animate-pulse rounded-xl bg-gray-100" />;
const Empty = ({ text = "No data to show yet." }) => (
  <div className="flex h-52 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">{text}</div>
);

/* ---------- Donut ---------- */
const DonutChart = ({ title, subtitle, items, loading, centerLabel = "Total", centerValue, className }) => {
  const [active, setActive] = useState(null);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const R = 62;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const current = active !== null ? items[active] : null;

  return (
    <Card title={title} subtitle={subtitle} className={className}>
      {loading ? <Skeleton /> : total === 0 ? <Empty /> : (
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <svg viewBox="0 0 160 160" className="h-44 w-44 shrink-0" role="img" aria-label={`${title} chart`}>
            <circle cx="80" cy="80" r={R} fill="none" stroke="#f1f5f9" strokeWidth="18" />
            {items.map((item, index) => {
              if (!item.value) return null;
              const length = (item.value / total) * C;
              const segment = (
                <circle
                  key={item.label}
                  cx="80" cy="80" r={R} fill="none"
                  stroke={item.color}
                  strokeWidth={active === index ? 22 : 18}
                  strokeDasharray={`${Math.max(length - 2, 0)} ${C - Math.max(length - 2, 0)}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 80 80)"
                  style={{ transition: "stroke-width .15s, stroke-dasharray .4s", cursor: "pointer" }}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                />
              );
              offset += length;
              return segment;
            })}
            <text x="80" y="76" textAnchor="middle" className="fill-gray-800" style={{ fontSize: 24, fontWeight: 700 }}>
              {current ? current.value : centerValue ?? total}
            </text>
            <text x="80" y="95" textAnchor="middle" className="fill-gray-400" style={{ fontSize: 10 }}>
              {current ? current.label : centerLabel}
            </text>
          </svg>
          <ul className="w-full space-y-1.5">
            {items.map((item, index) => (
              <li
                key={item.label}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm transition ${active === index ? "bg-purple-50" : ""}`}
              >
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </span>
                <span className="font-semibold text-gray-800">
                  {item.value} <span className="text-xs font-normal text-gray-400">({Math.round((item.value / total) * 100)}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

/* ---------- Multi-series smooth area/line trend ---------- */
const TrendChart = ({ title, subtitle, labels, series, loading, right, className }) => {
  const uid = useId().replace(/:/g, "");
  const [hover, setHover] = useState(null);
  const W = 640, H = 230;
  const pad = { t: 14, r: 14, b: 28, l: 30 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const top = Math.ceil(max / 4) * 4;
  const x = (i) => pad.l + (labels.length <= 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const y = (v) => pad.t + ih - (v / top) * ih;
  const line = (vals) => vals
    .map((v, i) => {
      if (i === 0) return `M${x(0)},${y(v)}`;
      const mid = (x(i - 1) + x(i)) / 2;
      return `C${mid},${y(vals[i - 1])} ${mid},${y(v)} ${x(i)},${y(v)}`;
    })
    .join(" ");
  const area = (vals) => `${line(vals)} L${x(vals.length - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`;
  const step = Math.ceil(labels.length / 7);
  const hasData = series.some((s) => s.values.some(Boolean));

  return (
    <Card title={title} subtitle={subtitle} right={right} className={className}>
      <div className="mb-3 flex min-h-[28px] flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {hover !== null ? (
          <>
            <span className="font-semibold text-gray-700">{labels[hover]}</span>
            {series.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-gray-600">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}: <strong className="text-gray-800">{s.values[hover]}</strong>
              </span>
            ))}
          </>
        ) : (
          series.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-gray-600">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}: <strong className="text-gray-800">{s.values.reduce((a, b) => a + b, 0)}</strong>
            </span>
          ))
        )}
      </div>
      {loading ? <Skeleton /> : !hasData ? <Empty text="No activity in this period." /> : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${title} chart`} onMouseLeave={() => setHover(null)}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.label} id={`${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0, 1, 2, 3, 4].map((tick) => {
            const value = (top * tick) / 4;
            return (
              <g key={tick}>
                <line x1={pad.l} x2={W - pad.r} y1={y(value)} y2={y(value)} stroke="#eef0f4" strokeDasharray={tick ? "3 4" : "0"} />
                <text x={pad.l - 6} y={y(value) + 3} textAnchor="end" style={{ fontSize: 10 }} className="fill-gray-400">{value}</text>
              </g>
            );
          })}
          {labels.map((label, i) => (i % step === 0 || i === labels.length - 1) && (
            <text key={label + i} x={x(i)} y={H - 8} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-400">{label}</text>
          ))}
          {series.map((s, i) => <path key={`a${s.label}`} d={area(s.values)} fill={`url(#${uid}-${i})`} />)}
          {series.map((s) => <path key={`l${s.label}`} d={line(s.values)} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinecap="round" />)}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="#c4b5fd" strokeDasharray="3 3" />
              {series.map((s) => <circle key={s.label} cx={x(hover)} cy={y(s.values[hover])} r="4" fill="#fff" stroke={s.color} strokeWidth="2" />)}
            </g>
          )}
          {labels.map((label, i) => (
            <rect
              key={`h${label}${i}`}
              x={x(i) - iw / labels.length / 2} y={pad.t}
              width={iw / labels.length} height={ih}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
            />
          ))}
        </svg>
      )}
    </Card>
  );
};

/* ---------- Column chart (revenue etc.) ---------- */
const ColumnChart = ({ title, subtitle, labels, values, color = "#8b5cf6", loading, format = (v) => v, right, className }) => {
  const [hover, setHover] = useState(null);
  const W = 640, H = 220;
  const pad = { t: 16, r: 10, b: 28, l: 10 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(1, ...values);
  const slot = iw / Math.max(labels.length, 1);
  const barW = Math.min(slot * 0.62, 36);
  const step = Math.ceil(labels.length / 8);

  return (
    <Card title={title} subtitle={subtitle} right={right} className={className}>
      <div className="mb-2 min-h-[20px] text-xs text-gray-600">
        {hover !== null
          ? <><span className="font-semibold text-gray-700">{labels[hover]}</span> · <strong className="text-gray-800">{format(values[hover])}</strong></>
          : <>Total: <strong className="text-gray-800">{format(values.reduce((a, b) => a + b, 0))}</strong></>}
      </div>
      {loading ? <Skeleton /> : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${title} chart`} onMouseLeave={() => setHover(null)}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih} y2={pad.t + ih} stroke="#e5e7eb" />
          {values.map((value, i) => {
            const h = (value / max) * ih;
            const cx = pad.l + slot * i + slot / 2;
            return (
              <g key={labels[i] + i} onMouseEnter={() => setHover(i)}>
                <rect x={cx - slot / 2} y={pad.t} width={slot} height={ih} fill="transparent" />
                <rect
                  x={cx - barW / 2} y={pad.t + ih - h} width={barW} height={Math.max(h, value ? 2 : 0)} rx="4"
                  fill={color} opacity={hover === null || hover === i ? 1 : 0.35}
                  style={{ transition: "opacity .15s" }}
                />
                {(i % step === 0 || i === values.length - 1) && (
                  <text x={cx} y={H - 8} textAnchor="middle" style={{ fontSize: 10 }} className="fill-gray-400">{labels[i]}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </Card>
  );
};

/* ================= Admin page ================= */

export const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ rooms: [], bookings: [], staff: [], requests: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [range, setRange] = useState(14);
  const [refreshKey, setRefreshKey] = useState(0);

  // FIX: allSettled (ek endpoint fail ho to baqi dashboard chalay), overlap-free polling,
  // 401 par logout redirect, aur unmount par in-flight requests cancel.
  useEffect(() => {
    const controller = new AbortController();
    let timeoutId;

    const load = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate(LOGIN_PATH, { replace: true });
        return;
      }

      if (!document.hidden) {
        const config = { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal };
        const results = await Promise.allSettled(ENDPOINTS.map((e) => axios.get(`${API}${e.path}`, config)));
        if (controller.signal.aborted) return;

        if (results.some((r) => r.status === "rejected" && r.reason?.response?.status === 401)) {
          sessionStorage.removeItem("token");
          navigate(LOGIN_PATH, { replace: true });
          return;
        }

        const failedLabels = [];
        setData((previous) => {
          const next = { ...previous };
          results.forEach((result, index) => {
            const endpoint = ENDPOINTS[index];
            if (result.status === "fulfilled") next[endpoint.key] = endpoint.pick(result.value.data) || [];
            else failedLabels.push(endpoint.label); // purana data screen par rehne dein
          });
          return next;
        });
        setFailed(failedLabels);
        setLastUpdated(new Date());
        setLoading(false);
      }

      timeoutId = window.setTimeout(load, REFRESH_MS); // pichli cycle khatam hone ke baad hi next
    };

    load();
    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [navigate, refreshKey]);

  const view = useMemo(() => {
    const { rooms, bookings, staff, requests, tasks } = data;

    const occupied = countStatus(rooms, "occupied");
    const completedTasks = countStatus(tasks, "completed");
    const resolvedRequests = countStatus(requests, ...DONE);
    const openRequests = requests.length - resolvedRequests;

    // Daily buckets for the selected range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: range }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (range - 1 - i));
      return d;
    });
    const index = new Map(days.map((d, i) => [dayKey(d), i]));
    const bucket = (list, valueOf = () => 1, filter = () => true) => {
      const values = Array(range).fill(0);
      list.forEach((item) => {
        if (!item.createdAt || !filter(item)) return;
        const i = index.get(dayKey(new Date(item.createdAt)));
        if (i !== undefined) values[i] += valueOf(item);
      });
      return values;
    };
    const trendLabels = days.map((d) => d.toLocaleDateString("en", { month: "short", day: "numeric" }));
    const revenue = bucket(bookings, bookingAmount, (b) => norm(b.status) !== "cancelled");

    // Service request types — fully dynamic from data
    const typeCounts = requests.reduce((acc, r) => {
      const label = (r.type || "other").replaceAll("-", " ");
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    const requestTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({ label: label.replace(/^./, (c) => c.toUpperCase()), value, color: TYPE_COLORS[i % TYPE_COLORS.length] }));

    const activity = [
      ...requests.map((r) => ({
        id: `request-${r._id}`,
        title: `${r.type?.replaceAll("-", " ") || "Service"} request · ${r.status || "pending"}`,
        detail: `Room ${r.room?.roomNumber || "—"}${r.guest?.name ? ` · ${r.guest.name}` : ""}${r.description ? ` · ${r.description}` : ""}`,
        date: r.updatedAt || r.createdAt,
      })),
      ...tasks.map((t) => ({
        id: `task-${t._id}`,
        title: `${t.taskType || "Room"} task · ${t.status || "pending"}`,
        detail: `Room ${t.room?.roomNumber || "—"}${t.assignedTo?.name ? ` · ${t.assignedTo.name}` : ""}`,
        date: t.updatedAt || t.createdAt,
      })),
      ...bookings.map((b) => ({
        id: `booking-${b._id}`,
        title: `Booking ${b.status || "updated"}`,
        detail: `Room ${b.room?.roomNumber || "—"}${b.guest?.name ? ` · ${b.guest.name}` : ""}`,
        date: b.updatedAt || b.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);

    return {
      stats: [
        { label: "Total Rooms", value: rooms.length, share: 100, tone: "bg-purple-600" },
        { label: "Available Rooms", value: countStatus(rooms, "available"), share: pct(countStatus(rooms, "available"), rooms.length), tone: "bg-emerald-500" },
        { label: "Occupied Rooms", value: occupied, share: pct(occupied, rooms.length), tone: "bg-amber-500" },
        { label: "Active Staff", value: staff.length, share: 100, tone: "bg-sky-500" },
        { label: "Bookings", value: bookings.length, share: pct(countStatus(bookings, "confirmed", "checked-in"), bookings.length), tone: "bg-violet-500", path: "/Manage-Bookings" },
        { label: "Open Requests", value: openRequests, share: pct(openRequests, requests.length), tone: "bg-orange-500", path: "/service-requests" },
      ],
      occupied, completedTasks, resolvedRequests, openRequests,
      occupancyRate: pct(occupied, rooms.length),
      taskCompletionRate: pct(completedTasks, tasks.length),
      requestResolutionRate: pct(resolvedRequests, requests.length),
      roomStatus: [
        { label: "Available", value: countStatus(rooms, "available"), color: "#10b981" },
        { label: "Occupied", value: occupied, color: "#8b5cf6" },
        { label: "Cleaning", value: countStatus(rooms, "cleaning"), color: "#f59e0b" },
        { label: "Maintenance", value: countStatus(rooms, "maintenance"), color: "#ef4444" },
        { label: "Unavailable", value: countStatus(rooms, "unavailable"), color: "#64748b" },
      ],
      bookingStatus: [
        { label: "Confirmed", value: countStatus(bookings, "confirmed"), color: "#3b82f6" },
        { label: "Checked in", value: countStatus(bookings, "checked-in"), color: "#10b981" },
        { label: "Checked out", value: countStatus(bookings, "checked-out"), color: "#8b5cf6" },
        { label: "Cancelled", value: countStatus(bookings, "cancelled"), color: "#ef4444" },
      ],
      taskStatus: [
        { label: "Pending", value: countStatus(tasks, "pending"), color: "#f59e0b" },
        { label: "In progress", value: countStatus(tasks, "in-progress"), color: "#3b82f6" },
        { label: "Completed", value: completedTasks, color: "#10b981" },
      ],
      trendLabels,
      trendSeries: [
        { label: "Bookings", color: "#8b5cf6", values: bucket(bookings) },
        { label: "Service requests", color: "#f97316", values: bucket(requests) },
        { label: "Housekeeping tasks", color: "#10b981", values: bucket(tasks) },
      ],
      revenue,
      hasRevenue: revenue.some(Boolean),
      requestTypes,
      activity,
      escalated: requests
        .filter((r) => r.escalatedToAdmin)
        .sort((a, b) => new Date(b.escalatedAt || b.updatedAt || 0) - new Date(a.escalatedAt || a.updatedAt || 0)),
    };
  }, [data, range]);

  const quickActions = [
    { title: "Upload Room", description: "Add a new room to inventory", path: "/rooms/upload" },
    { title: "Manage Rooms", description: "View, edit, and delete rooms", path: "/rooms/manage" },
    { title: "Manage Staff", description: "Update staff details and roles", path: "/ManageStaffs" },
  ];

  const rangePicker = (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-gray-500">Trend range</span>
      <div className="inline-flex rounded-lg border border-purple-100 bg-white p-0.5 shadow-sm" role="group" aria-label="Date range">
        {RANGES.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setRange(days)}
            aria-pressed={range === days}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${range === days ? "bg-purple-600 text-white shadow" : "text-purple-700 hover:bg-purple-50"}`}
          >
            {days}d
          </button>
        ))}
      </div>
    </div>
  );

  const escalationCount = view.escalated.length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="mt-1 text-gray-500">Live overview of hotel inventory, staffing, and operations.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-gray-400">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en", { timeStyle: "short" })} · auto-refresh ${REFRESH_MS / 1000}s` : "Loading…"}
                </span>
                {rangePicker}
                <button
                  type="button"
                  onClick={() => setRefreshKey((key) => key + 1)}
                  className="rounded-lg border border-purple-100 bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
                >
                  Refresh now
                </button>
              </div>
            </div>

            {failed.length > 0 && (
              <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                Could not refresh: {failed.join(", ")}. Showing the last loaded data for these.
              </div>
            )}

            {/* Summary strip */}
            <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {view.stats.map((stat) => {
                const Tag = stat.path ? "button" : "div";
                return (
                  <Tag
                    key={stat.label}
                    {...(stat.path ? { type: "button", onClick: () => navigate(stat.path) } : {})}
                    className={`rounded-2xl border border-purple-100 bg-white p-4 text-left shadow-md ${stat.path ? "transition hover:-translate-y-0.5 hover:shadow-lg" : ""}`}
                  >
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800">{loading ? "—" : stat.value}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${stat.tone} transition-all duration-500`} style={{ width: `${loading ? 0 : stat.share}%` }} />
                    </div>
                  </Tag>
                );
              })}
            </div>

            {/* Urgent: escalations jump to the top only when something needs the admin */}
            {escalationCount > 0 && (
              <section className="mb-5 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm" aria-label="Requests escalated to admin">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Manager escalations</h2>
                    <p className="mt-1 text-sm text-gray-500">Guest requests a manager has sent for admin attention.</p>
                  </div>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
                    {escalationCount} {escalationCount === 1 ? "request" : "requests"}
                  </span>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {view.escalated.map((request) => {
                    const complete = DONE.includes(norm(request.status));
                    return (
                      <article
                        key={request._id}
                        className={`rounded-xl border p-4 ${
                          complete ? "border-emerald-200 bg-emerald-50" : "border-rose-100 bg-rose-50/50"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold capitalize text-gray-800">{request.type?.replaceAll("-", " ") || "Service request"}</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {request.guest?.name || "Guest"} · Room {request.room?.roomNumber || "—"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              complete ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                            }`}>{complete ? "Completed" : (request.status || "pending").replaceAll("-", " ")}</span>
                            {request.escalatedBy?.name && <span className="text-xs text-gray-500">By {request.escalatedBy.name}</span>}
                          </div>
                        </div>
                        {request.description && <p className="mt-3 text-sm text-gray-700">{request.description}</p>}
                        <div className={`mt-3 border-l-2 pl-3 ${complete ? "border-emerald-300" : "border-rose-300"}`}>
                          <p className={`text-xs font-bold uppercase tracking-wide ${complete ? "text-emerald-700" : "text-rose-700"}`}>Manager’s reason</p>
                          <p className="mt-1 text-sm text-gray-700">{request.escalationToAdminReason || "No reason supplied."}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/service-requests?request=${request._id}`)}
                          className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                            complete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                          }`}
                        >
                          {complete ? "View completed request" : "Review request"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Charts — now the main focus of the page */}
            <section className="mb-8 space-y-5" aria-label="Admin charts">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <TrendChart
                  className="xl:col-span-2"
                  title="Activity trend"
                  subtitle={`New bookings, requests and tasks over the last ${range} days`}
                  labels={view.trendLabels}
                  series={view.trendSeries}
                  loading={loading}
                />
                <DonutChart title="Room status" subtitle="Live distribution across inventory" items={view.roomStatus} loading={loading} centerLabel="Occupancy" centerValue={`${view.occupancyRate}%`} />
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                <DonutChart title="Booking pipeline" subtitle={`${data.bookings.length} bookings by status`} items={view.bookingStatus} loading={loading} centerLabel="Bookings" />
                <DonutChart title="Housekeeping tasks" subtitle="Progress across all tasks" items={view.taskStatus} loading={loading} centerLabel="Completed" centerValue={`${view.taskCompletionRate}%`} />
                <DashboardBarChart title="Requests by type" subtitle="Most common guest requests" items={view.requestTypes} loading={loading} accent="#7c3aed" />
              </div>

              {view.hasRevenue && (
                <ColumnChart
                  title="Booking revenue"
                  subtitle={`Non-cancelled bookings created in the last ${range} days`}
                  labels={view.trendLabels}
                  values={view.revenue}
                  format={money}
                  loading={loading}
                />
              )}
            </section>

            {/* KPIs */}
            <section className="mb-8" aria-label="Admin key performance indicators">
              <div className="mb-3">
                <h2 className="text-lg font-bold text-gray-800">Key performance indicators</h2>
                <p className="text-xs text-gray-500">Calculated from current hotel records</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <DashboardKpiCard label="Room occupancy" value={loading ? "—" : `${view.occupancyRate}%`} detail={`${view.occupied} of ${data.rooms.length} rooms occupied`} color="#8b5cf6" />
                <DashboardKpiCard label="Task completion" value={loading ? "—" : `${view.taskCompletionRate}%`} detail={`${view.completedTasks} of ${data.tasks.length} tasks completed`} color="#10b981" />
                <DashboardKpiCard label="Requests resolved" value={loading ? "—" : `${view.requestResolutionRate}%`} detail={`${view.resolvedRequests} of ${data.requests.length} requests resolved`} color="#f97316" />
              </div>
            </section>

            {/* Quiet state: nothing escalated */}
            {!loading && escalationCount === 0 && (
              <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                No manager escalations right now.
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-lg xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                  <span className="text-sm font-semibold text-purple-600">Operations</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {quickActions.map((action) => (
                    <div key={action.title} className="rounded-xl border border-purple-100 bg-purple-50 p-4 transition hover:shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">{action.title}</h4>
                      <p className="mt-2 text-sm text-gray-600">{action.description}</p>
                      <button type="button" onClick={() => navigate(action.path)} className="mt-4 w-full rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">Open</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Recent Activity</h3>
                {loading ? <p className="text-sm text-gray-500">Loading activity…</p> : view.activity.length ? (
                  <div className="space-y-4">
                    {view.activity.map((item) => (
                      <div key={item.id} className="border-l-4 border-purple-500 pl-4">
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