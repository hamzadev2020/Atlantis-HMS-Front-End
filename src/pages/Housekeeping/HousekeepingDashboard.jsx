import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ClipboardCheck, Clock3, LogOut, RefreshCw, Search, Sparkles } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProfilePictureControl } from "../../Components/ProfilePictureControl.jsx";
import hotelLogo from "../../assets/HMSLOGO.jpg";
import "./housekeeping.css";
const API_BASE = import.meta.env.VITE_API_URL;


const API = `${API_BASE}/housekeeping-tasks`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Today";
const readable = (value = "") => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const HousekeepingDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [savingId, setSavingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    axios.get(API, authConfig()).then((response) => {
      if (!active) return;
      const ownTasks = response.data?.tasks || [];
      setTasks(ownTasks);
      setNotes(Object.fromEntries(ownTasks.map((task) => [task._id, task.notes || ""])));
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Your tasks could not be loaded.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    const intervalId = window.setInterval(() => setRefreshKey((current) => current + 1), 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [refreshKey]);

  const updateTask = async (task, status) => {
    setSavingId(task._id);
    setError("");
    setNotice("");
    try {
      const response = await axios.put(`${API}/${task._id}`, {
        status,
        notes: notes[task._id] ?? task.notes ?? "",
      }, authConfig());
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.task : item));
      setNotes((current) => ({ ...current, [task._id]: response.data.task.notes || "" }));
      setNotice(`Room ${task.room?.roomNumber || "task"} updated to ${readable(status)}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This task could not be updated.");
    } finally {
      setSavingId("");
    }
  };

  const counts = useMemo(() => ({
    assigned: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    active: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  }), [tasks]);
  const completionRate = counts.assigned ? Math.round((counts.completed / counts.assigned) * 100) : 0;
  const typeCounts = {
    cleaning: tasks.filter((task) => task.taskType === "cleaning").length,
    maintenance: tasks.filter((task) => task.taskType === "maintenance").length,
  };
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesType = taskTypeFilter === "all" || task.taskType === taskTypeFilter;
      const searchableText = [
        task.room?.roomNumber,
        task.room?.roomType,
        task.taskType,
        task.status,
        task.remarks,
        task.notes,
        task.relatedServiceRequest?.description,
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesStatus && matchesType && (!query || searchableText.includes(query));
    });
  }, [tasks, search, statusFilter, taskTypeFilter]);
  const activeTasks = filteredTasks.filter((task) => task.status !== "completed");
  const completedTasks = filteredTasks.filter((task) => task.status === "completed");

  return (
    <div className="housekeeping-app">
      <header className="housekeeping-topbar">
        <div className="housekeeping-brand">
          <span className="housekeeping-brand-logo"><img src={hotelLogo} alt="Hotel Management System" /></span>
          <div><strong>HOUSEKEEPING</strong><small>ATLANTIS · OPERATIONS</small></div>
        </div>
        <div className="housekeeping-header-actions">
          <ProfilePictureControl accent="emerald" />
          <button className="housekeeping-refresh" type="button" onClick={() => setRefreshKey((current) => current + 1)} title="Refresh tasks" aria-label="Refresh tasks"><RefreshCw size={17} /></button>
          <button className="housekeeping-logout" type="button" onClick={() => { sessionStorage.removeItem("token"); sessionStorage.removeItem("role"); navigate("/login"); }} title="Log out" aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </header>
      <main className="housekeeping-main">
        <section className="housekeeping-welcome">
          <div><span className="housekeeping-kicker"><Sparkles size={14} /> YOUR SHIFT</span><h1>Room care,<br /><em>in progress.</em></h1><p>Your assigned tasks for today are all gathered here.</p></div>
          <div className="housekeeping-welcome-art" aria-hidden="true"><ClipboardCheck size={56} strokeWidth={1.2} /></div>
        </section>

        {error && <div className="housekeeping-alert" role="alert">{error}</div>}
        {notice && <div className="housekeeping-alert success" role="status"><Check size={16} />{notice}</div>}

        <section className="housekeeping-counts" aria-label="Task summary">
          <article><span>TOTAL ASSIGNED</span><strong>{loading ? "—" : counts.assigned.toString().padStart(2, "0")}</strong><small>All your room tasks</small></article>
          <article><span>WAITING</span><strong>{loading ? "—" : counts.pending.toString().padStart(2, "0")}</strong><small>Ready to be started</small></article>
          <article><span>IN PROGRESS</span><strong>{loading ? "—" : counts.active.toString().padStart(2, "0")}</strong><small>Currently being handled</small></article>
          <article><span>COMPLETED</span><strong>{loading ? "—" : counts.completed.toString().padStart(2, "0")}</strong><small>Finished room tasks</small></article>
        </section>

        <section className="housekeeping-analytics" aria-label="Shift analytics">
          <div className="housekeeping-analytics-copy"><span className="housekeeping-kicker">SHIFT ANALYTICS</span><h2>Work completed</h2><p>{counts.completed} of {counts.assigned} assigned tasks finished</p></div>
          <div className="housekeeping-completion"><div className="housekeeping-completion-label"><span>Completion rate</span><strong>{loading ? "—" : `${completionRate}%`}</strong></div><div className="housekeeping-progress-track"><span style={{ width: `${completionRate}%` }} /></div></div>
          <div className="housekeeping-category-analytics">
            <div><span className="housekeeping-category-dot cleaning" /><span>Cleaning</span><strong>{loading ? "—" : typeCounts.cleaning}</strong></div>
            <div><span className="housekeeping-category-dot maintenance" /><span>Maintenance</span><strong>{loading ? "—" : typeCounts.maintenance}</strong></div>
          </div>
        </section>

        <section className="housekeeping-task-section">
          <div className="housekeeping-section-heading"><div><span className="housekeeping-kicker">ASSIGNED WORK</span><h2>Find a task</h2></div><span className="housekeeping-updated"><Clock3 size={14} /> Updates automatically every 15 seconds</span></div>
          <div className="housekeeping-task-filters">
            <label className="housekeeping-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search room, task, or request…" aria-label="Search tasks" /></label>
            <div className="housekeeping-filter-group" role="group" aria-label="Filter task type">
              {[["all", "All categories"], ["cleaning", "Cleaning"], ["maintenance", "Maintenance"]].map(([value, label]) => (
                <button key={value} type="button" className={taskTypeFilter === value ? "is-active" : ""} onClick={() => setTaskTypeFilter(value)}>{label}</button>
              ))}
            </div>
            <label className="housekeeping-status-filter"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by task status">
              <option value="all">All statuses</option><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option>
            </select></label>
          </div>
          {loading ? <div className="housekeeping-empty">Loading your assigned tasks…</div> : (
            <>
              <div className="housekeeping-task-section-heading"><h3><ClipboardCheck size={17} /> Current tasks</h3><span>{activeTasks.length} {activeTasks.length === 1 ? "task" : "tasks"}</span></div>
              {activeTasks.length ? (
                <div className="housekeeping-task-list">
              {activeTasks.map((task) => (
                <article className={`housekeeping-task-card task-${task.status || "pending"}`} key={task._id}>
                  <div className={`housekeeping-task-mark task-type-${task.taskType}`}><ClipboardCheck size={20} /></div>
                  <div className="housekeeping-task-content">
                    <div className="housekeeping-task-title"><div><span className="housekeeping-task-type">{readable(task.taskType)}</span><h3>Room {task.room?.roomNumber || "—"}</h3><p>{task.room?.roomType || "Guest room"} · Assigned {dateLabel(task.createdAt)}</p></div><span className={`housekeeping-status status-${task.status || "pending"}`}>{readable(task.status || "pending")}</span></div>
                    {task.remarks && <p className="housekeeping-task-notes"><strong>Reception remarks:</strong> {task.remarks}</p>}
                    {task.notes && <p className="housekeeping-task-notes"><strong>Your latest note for reception:</strong> {task.notes}</p>}
                    {task.relatedServiceRequest?.description && <p className="housekeeping-task-notes"><strong>Guest request:</strong> {task.relatedServiceRequest.description}</p>}
                    <div className="housekeeping-task-controls">
                      <label className="housekeeping-note-input"><span>Progress note for reception</span><input value={notes[task._id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [task._id]: event.target.value }))} placeholder="Share an update with reception" maxLength={300} /></label>
                      <label className="housekeeping-status-input"><span>Update status</span><select value={task.status || "pending"} onChange={(event) => updateTask(task, event.target.value)} disabled={savingId === task._id}>
                        <option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option>
                      </select></label>
                      <button className="housekeeping-save" type="button" onClick={() => updateTask(task, task.status || "pending")} disabled={savingId === task._id}>{savingId === task._id ? "Saving…" : "Save note"}</button>
                    </div>
                  </div>
                </article>
              ))}
                </div>
              ) : <div className="housekeeping-empty"><ClipboardCheck size={22} /><strong>{tasks.length ? "No current tasks match these filters." : "No tasks assigned right now."}</strong><span>{tasks.length ? "Try another category, status, or search." : "Your new assignments from reception will appear here."}</span></div>}

              <div className="housekeeping-completed-section">
                <div className="housekeeping-task-section-heading"><h3><CheckCircle2 size={17} /> Completed tasks</h3><span>{completedTasks.length} {completedTasks.length === 1 ? "task" : "tasks"}</span></div>
                {completedTasks.length ? (
                  <div className="housekeeping-task-list">
                    {completedTasks.map((task) => (
                      <article className="housekeeping-task-card task-completed" key={task._id}>
                        <div className="housekeeping-task-mark task-completed-mark"><CheckCircle2 size={20} /></div>
                        <div className="housekeeping-task-content">
                          <div className="housekeeping-task-title"><div><span className="housekeeping-task-type">{readable(task.taskType)}</span><h3>Room {task.room?.roomNumber || "—"}</h3><p>{task.room?.roomType || "Guest room"} · Assigned {dateLabel(task.createdAt)}{task.completedAt ? ` · Completed ${dateLabel(task.completedAt)}` : ""}</p></div><span className="housekeeping-status status-completed">Completed</span></div>
                          {task.remarks && <p className="housekeeping-task-notes"><strong>Reception remarks:</strong> {task.remarks}</p>}
                          {task.notes && <p className="housekeeping-task-notes"><strong>Completion note:</strong> {task.notes}</p>}
                          {task.relatedServiceRequest?.description && <p className="housekeeping-task-notes"><strong>Guest request:</strong> {task.relatedServiceRequest.description}</p>}
                          <div className="housekeeping-task-controls">
                            <label className="housekeeping-note-input"><span>Completion note</span><input value={notes[task._id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [task._id]: event.target.value }))} placeholder="Add a note for reception" maxLength={300} /></label>
                            <label className="housekeeping-status-input"><span>Task status</span><select value={task.status} onChange={(event) => updateTask(task, event.target.value)} disabled={savingId === task._id}>
                              <option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option>
                            </select></label>
                            <button className="housekeeping-save" type="button" onClick={() => updateTask(task, task.status)} disabled={savingId === task._id}>{savingId === task._id ? "Saving…" : "Save note"}</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : <div className="housekeeping-empty housekeeping-empty-compact"><CheckCircle2 size={19} /><span>{tasks.length ? "No completed tasks match these filters." : "Completed jobs will be collected here."}</span></div>}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};
