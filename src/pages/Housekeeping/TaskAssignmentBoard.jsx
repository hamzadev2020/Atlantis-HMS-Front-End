import { useEffect, useEffectEvent, useState } from "react";
import { ArrowRight, Brush, CheckCircle2, ClipboardList, LoaderCircle, RefreshCw, UserRound } from "lucide-react";
import axios from "axios";
import { Navbar as ReceptionistNavbar } from "../../Components/Receptionist/Navbar.jsx";
import { Sidebar as ReceptionistSidebar } from "../../Components/Receptionist/Sidebar.jsx";
import { Navbar as ManagerNavbar } from "../../Components/Manager/Navbar.jsx";
import { Sidebar as ManagerSidebar } from "../../Components/Manager/Sidebar.jsx";
import "./task-board.css";

const API_BASE = import.meta.env.VITE_API_URL;

const API = `${API_BASE}/housekeeping-tasks`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
const statuses = ["pending", "in-progress", "completed"];
const readable = (value = "") => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const TaskAssignmentBoard = ({ audience = "receptionist", showAssignment = true }) => {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignedRole, setAssignedRole] = useState("housekeeping");
  const [form, setForm] = useState({ room: "", assignedTo: "", taskType: "cleaning", remarks: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyTaskId, setBusyTaskId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const getAssignedRole = useEffectEvent(() => assignedRole);

  useEffect(() => {
    let active = true;
    const currentAssignedRole = getAssignedRole();
    const requests = [axios.get(`${API}/housekeeping-tasks`, authConfig())];
    if (showAssignment) {
      requests.push(axios.get(`${API}/ManageRooms`, authConfig()));
      requests.push(axios.get(`${API}/user/staffs`, authConfig()));
    }
    Promise.all(requests).then((responses) => {
      if (!active) return;
      setTasks(responses[0].data?.tasks || []);
      if (showAssignment) {
        const roomData = responses[1].data;
        const roomList = Array.isArray(roomData) ? roomData : roomData?.rooms || roomData?.data || [];
        const staffList = responses[2].data?.staffs || [];
        const defaultAssignee = staffList.find((person) => person.role === "housekeeping") || staffList.find((person) => person.role === "manager");
        const selectedRole = staffList.some((person) => person.role === currentAssignedRole)
          ? currentAssignedRole
          : defaultAssignee?.role || "housekeeping";
        setRooms(roomList.filter((room) => room.isActive !== false));
        setStaff(staffList.filter((person) => ["manager", "housekeeping"].includes(person.role)));
        setAssignedRole(selectedRole);
        setForm((current) => ({
          ...current,
          room: current.room || roomList[0]?._id || "",
          assignedTo: staffList.some((person) => person._id === current.assignedTo && person.role === selectedRole)
            ? current.assignedTo
            : staffList.find((person) => person.role === selectedRole)?._id || "",
        }));
      }
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Task data could not be loaded.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    const intervalId = window.setInterval(() => setRefreshKey((current) => current + 1), 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [refreshKey, showAssignment]);

  const submitTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await axios.post(`${API}/housekeeping-tasks`, { ...form, relatedServiceRequest: null }, authConfig());
      setNotice("Task assigned successfully.");
      setForm((current) => ({ ...current, remarks: "" }));
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The task could not be assigned.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (task, status) => {
    setBusyTaskId(task._id);
    setError("");
    try {
      const response = await axios.put(`${API}/housekeeping-tasks/${task._id}`, { status }, authConfig());
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.task : item));
      setNotice(`Room ${task.room?.roomNumber || "task"} updated.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Task status could not be updated.");
    } finally {
      setBusyTaskId("");
    }
  };

  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const availableAssignees = staff.filter((person) => person.role === assignedRole);
  const Navbar = audience === "manager" ? ManagerNavbar : ReceptionistNavbar;
  const Sidebar = audience === "manager" ? ManagerSidebar : ReceptionistSidebar;

  return (
    <div className="task-board-shell min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="task-board-main flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <header className="task-board-header">
              <div><span className="task-board-kicker">HOUSEKEEPING OPERATIONS</span><h1>{showAssignment ? "Assignments & task board" : "Task progress"}</h1><p>{showAssignment ? "Assign room work to housekeeping or a manager, then follow progress." : "Review room tasks and current completion status."}</p></div>
              <button className="task-board-refresh" type="button" onClick={() => setRefreshKey((current) => current + 1)} aria-label="Refresh tasks" title="Refresh"><RefreshCw size={17} /></button>
            </header>

            {notice && <div className="task-board-message success" role="status"><CheckCircle2 size={16} />{notice}</div>}
            {error && <div className="task-board-message error" role="alert">{error}</div>}

            <section className="task-board-stats" aria-label="Task status overview">
              <article><span>ALL TASKS</span><strong>{loading ? "—" : tasks.length.toString().padStart(2, "0")}</strong></article>
              <article><span>WAITING</span><strong>{loading ? "—" : pending.toString().padStart(2, "0")}</strong></article>
              <article><span>IN PROGRESS</span><strong>{loading ? "—" : inProgress.toString().padStart(2, "0")}</strong></article>
              <article><span>COMPLETED</span><strong>{loading ? "—" : completed.toString().padStart(2, "0")}</strong></article>
            </section>

            <div className={`task-board-grid${showAssignment ? " has-form" : ""}`}>
              {showAssignment && (
                <section className="task-board-form-panel">
                  <div className="task-board-panel-heading"><span><Brush size={17} /></span><div><h2>Assign a room task</h2><p>Choose the room and staff member responsible.</p></div></div>
                  <form className="task-board-form" onSubmit={submitTask}>
                    <label>Room<select value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} required>
                      {rooms.map((room) => <option key={room._id} value={room._id}>Room {room.roomNumber} · {room.roomType}</option>)}
                    </select></label>
                    <fieldset className="task-board-assignment-field">
                      <legend>Assign task to</legend>
                      <div className="task-board-assignment-buttons">
                        {["housekeeping", "manager"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            aria-pressed={assignedRole === role}
                            disabled={!staff.some((person) => person.role === role)}
                            className={assignedRole === role ? "is-selected" : ""}
                            onClick={() => {
                              setAssignedRole(role);
                              setForm((current) => ({
                                ...current,
                                assignedTo: staff.find((person) => person.role === role)?._id || "",
                              }));
                            }}
                          >
                            {role === "housekeeping" ? "Assign to Housekeeping" : "Assign to Manager"}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label>Staff member<select value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))} required>
                      {availableAssignees.map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}
                    </select></label>
                    <label>Task type<select value={form.taskType} onChange={(event) => setForm((current) => ({ ...current, taskType: event.target.value }))}>
                      <option value="cleaning">Cleaning</option><option value="maintenance">Maintenance</option>
                    </select></label>
                    <label>Reception remarks <span>(optional)</span><textarea value={form.remarks} onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))} maxLength={500} placeholder="Instructions or message for the assigned staff and reception" /></label>
                    <button type="submit" disabled={saving || !rooms.length || !availableAssignees.length || !form.assignedTo}>{saving ? <LoaderCircle className="animate-spin" size={16} /> : <ArrowRight size={16} />}{saving ? "Assigning…" : `Assign to ${readable(assignedRole)}`}</button>
                    {(!loading && (!rooms.length || !staff.length)) && <small className="task-board-form-hint">Add active rooms and housekeeping/manager staff before assigning tasks.</small>}
                  </form>
                </section>
              )}

              <section className="task-board-list-panel">
                <div className="task-board-panel-heading"><span><ClipboardList size={17} /></span><div><h2>Room task list</h2><p>{tasks.length} {tasks.length === 1 ? "assignment" : "assignments"}</p></div></div>
                {loading ? <div className="task-board-empty">Loading task board…</div> : tasks.length ? (
                  <div className="task-board-task-list">
                    {tasks.map((task) => (
                      <article className="task-board-task" key={task._id}>
                        <div className="task-board-task-top"><div><span className="task-board-type">{readable(task.taskType)}</span><h3>Room {task.room?.roomNumber || "—"}</h3><p>{task.room?.roomType || "Guest room"}</p></div><span className={`task-board-status status-${task.status || "pending"}`}>{readable(task.status || "pending")}</span></div>
                        <div className="task-board-assignee"><UserRound size={14} /><span>{task.assignedTo?.name || "Unassigned"}</span><small>{readable(task.assignedTo?.role || "")}</small></div>
                        {task.remarks && <p className="task-board-notes"><strong>Reception remarks:</strong> {task.remarks}</p>}
                        {task.notes && <p className="task-board-notes">{task.notes}</p>}
                        {task.relatedServiceRequest && <p className="task-board-related">Guest request: {readable(task.relatedServiceRequest.type)} · {task.relatedServiceRequest.description}</p>}
                        <div className="task-board-task-footer"><span>Assigned {dateLabel(task.createdAt)}</span><label>Status<select value={task.status || "pending"} disabled={busyTaskId === task._id} onChange={(event) => updateStatus(task, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{readable(status)}</option>)}</select></label></div>
                      </article>
                    ))}
                  </div>
                ) : <div className="task-board-empty"><ClipboardList size={22} /><strong>No room tasks yet.</strong><span>New assignments will appear here.</span></div>}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
