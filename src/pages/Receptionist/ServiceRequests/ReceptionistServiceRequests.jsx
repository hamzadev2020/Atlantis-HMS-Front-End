import { useEffect, useState } from "react";

import { ArrowUpRight, CheckCircle2, CircleDollarSign, ClipboardList, ConciergeBell, LoaderCircle, RotateCw, Trash2, UsersRound } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar } from "../../../Components/Receptionist/Navbar.jsx";
import { Sidebar } from "../../../Components/Receptionist/Sidebar.jsx";
import "../../Guest/guest-pages.css";
import "./ReceptionistServiceRequests.css";


const API = `${import.meta.env.VITE_API_URL}`;
const authConfig = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } });
const statuses = ["pending", "assigned", "forwarded", "in-progress", "resolved", "completed"];
const readable = (value = "") => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function ReceptionistServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [charges, setCharges] = useState({});
  const [assignment, setAssignment] = useState(null);
  const [billedRequestIds, setBilledRequestIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = async () => {
    setLoading((current) => current || requests.length === 0);
    try {
      const response = await axios.get(`${API}/service-requests`, authConfig());
      const loadedRequests = response.data?.serviceRequests || [];
      setRequests(loadedRequests);
      setError("");
      setBilledRequestIds(new Set(loadedRequests.filter((request) => (
        request.booking?.additionalServices || []
      ).some((service) => String(service.serviceRequest?._id || service.serviceRequest) === String(request._id))).map((request) => request._id)));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load guest requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchRequests = () => axios.get(`${API}/service-requests`, authConfig()).then((response) => {
      if (active) {
        const loadedRequests = response.data?.serviceRequests || [];
        setRequests(loadedRequests);
        setError("");
        setBilledRequestIds(new Set(loadedRequests.filter((request) => (
          request.booking?.additionalServices || []
        ).some((service) => String(service.serviceRequest?._id || service.serviceRequest) === String(request._id))).map((request) => request._id)));
      }
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Could not load guest requests.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    fetchRequests();
    const intervalId = window.setInterval(fetchRequests, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let active = true;
    axios.get(`${API}/user/staffs`, authConfig()).then((response) => {
      if (active) setStaff((response.data?.staffs || []).filter((person) => ["housekeeping", "manager"].includes(person.role)));
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Staff list could not be loaded for task assignment.");
    });
    return () => { active = false; };
  }, []);

  const updateStatus = async (request, status) => {
    setBusyId(request._id);
    setNotice("");
    try {
      const response = await axios.put(`${API}/service-requests/${request._id}`, { status }, authConfig());
      setRequests((current) => current.map((item) => item._id === request._id ? { ...item, ...response.data.serviceRequest } : item));
      setNotice("Request status updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Request status could not be updated.");
    } finally {
      setBusyId("");
    }
  };

  const deleteRequest = async (request) => {
    if (!window.confirm(`Delete the service request from ${request.guest?.name || "this guest"}?`)) return;
    setBusyId(request._id);
    setError("");
    setNotice("");
    try {
      await axios.delete(`${API}/service-requests/${request._id}`, authConfig());
      setRequests((current) => current.filter((item) => item._id !== request._id));
      setNotice("Service request deleted.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The service request could not be deleted.");
    } finally {
      setBusyId("");
    }
  };

  const addChargeAndInvoice = async (request) => {
    const bookingId = request.booking?._id || request.booking;
    const charge = charges[request._id] || {};
    if (!bookingId || !charge.serviceName?.trim() || !Number.isFinite(Number(charge.amount)) || Number(charge.amount) < 0) {
      setError("Enter a service description and a valid non-negative amount.");
      return;
    }

    setBusyId(request._id);
    setError("");
    setNotice("");
    try {
      await axios.put(`${API}/ManageBookings/${bookingId}/services`, {
        serviceName: charge.serviceName.trim(),
        amount: Number(charge.amount),
        serviceRequestId: request._id,
      }, authConfig());
      setBilledRequestIds((current) => new Set(current).add(request._id));
      setNotice("Charge added. The updated invoice is now available to the guest.");
      setCharges((current) => ({ ...current, [request._id]: { serviceName: "", amount: "" } }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The charge could not be added to this booking.");
    } finally {
      setBusyId("");
    }
  };

  const openAssignment = (request, role) => {
    const assignedTo = staff.find((person) => person.role === role)?._id || "";
    setAssignment({
      request,
      role,
      assignedTo,
      remarks: request.description ? `Guest request: ${request.description}` : "",
    });
    setError("");
  };

  const assignRequestTask = async (event) => {
    event.preventDefault();
    const { request, assignedTo, remarks } = assignment;
    const roomId = request.room?._id || request.room;
    if (!roomId || !assignedTo) {
      setError("Select an active staff member before assigning this request.");
      return;
    }

    setBusyId(request._id);
    setError("");
    setNotice("");
    try {
      await axios.post(`${API}/housekeeping-tasks`, {
        room: roomId,
        assignedTo,
        taskType: request.type === "maintenance" ? "maintenance" : "cleaning",
        relatedServiceRequest: request._id,
        remarks: remarks.trim(),
      }, authConfig());
      await loadRequests();
      setAssignment(null);
      setNotice(`Task assigned to ${assignment.role === "manager" ? "the manager" : "housekeeping"}.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "The request could not be assigned as a room task.");
    } finally {
      setBusyId("");
    }
  };

  const pendingCount = requests.filter((request) => !["completed", "resolved"].includes(request.status)).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="receptionist-request-layout flex min-h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">FRONT DESK</p><h1 className="mt-2 text-3xl font-bold text-slate-800">Guest service requests</h1><p className="mt-1 text-sm text-slate-500">Review requests, update progress, and add approved extras to a guest invoice.</p></div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{pendingCount} open</span>
                <button className="grid h-10 w-10 place-items-center border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" type="button" onClick={loadRequests} aria-label="Refresh requests" title="Refresh"><RotateCw size={17} /></button>
              </div>
            </div>

            {notice && <div className="mb-4 flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status"><CheckCircle2 size={16} />{notice}</div>}
            {error && <div className="mb-4 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}

            {loading ? <div className="border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading guest requests…</div> : requests.length ? (
              <div className="guest-reception-list">
                {requests.map((request) => {
                  const bookingId = request.booking?._id || request.booking;
                  const charge = charges[request._id] || { serviceName: readable(request.type), amount: "" };
                  const housekeepingTask = request.housekeepingTask;
                  return (
                    <article className="guest-reception-card" key={request._id}>
                      <div className="guest-reception-card-top">
                        <div>
                          <h2>{readable(request.type)}</h2>
                          <p>{request.description || "No additional details provided."}</p>
                          <div className="guest-reception-meta">
                            <span><strong>Guest:</strong> {request.guest?.name || "Guest"}</span>
                            <span><strong>Room:</strong> {request.room?.roomNumber || "—"}</span>
                            <span><strong>Stay:</strong> {dateLabel(request.booking?.checkInDate)} to {dateLabel(request.booking?.checkOutDate)}</span>
                            <span><strong>Received:</strong> {dateLabel(request.createdAt)}</span>
                          </div>
                          <div className="service-request-housekeeping-progress">
                            <span>Housekeeping progress</span>
                            <strong className={`service-request-housekeeping-status${housekeepingTask ? ` status-${housekeepingTask.status}` : ""}`}>
                              {housekeepingTask ? readable(housekeepingTask.status) : "Not assigned"}
                            </strong>
                            {housekeepingTask?.assignedTo?.name && <span>Assigned to {housekeepingTask.assignedTo.name}</span>}
                            {housekeepingTask?.completedAt && <span>Completed {dateLabel(housekeepingTask.completedAt)}</span>}
                            {housekeepingTask?.notes && <p>{housekeepingTask.notes}</p>}
                          </div>
                        </div>
                        <span className={`guest-status guest-status-${request.status || "pending"}`}>{readable(request.status || "pending")}</span>
                      </div>
                      <div className="guest-reception-actions">
                        <button className="guest-action-button secondary" type="button" disabled={busyId === request._id} onClick={() => deleteRequest(request)}>
                          {busyId === request._id ? <LoaderCircle className="animate-spin" size={14} /> : <Trash2 size={14} />} Delete request
                        </button>
                        <div className="guest-field">
                          <label htmlFor={`status-${request._id}`}>Reception status (shared with guest)</label>
                          <select id={`status-${request._id}`} value={request.status || "pending"} disabled={busyId === request._id} onChange={(event) => updateStatus(request, event.target.value)}>
                            {statuses.map((status) => <option key={status} value={status}>{readable(status)}</option>)}
                          </select>
                        </div>
                        <div className="guest-field">
                          <label htmlFor={`service-${request._id}`}>Invoice item</label>
                          <input id={`service-${request._id}`} value={charge.serviceName} onChange={(event) => setCharges((current) => ({ ...current, [request._id]: { ...charge, serviceName: event.target.value } }))} placeholder="Service provided" />
                        </div>
                        <div className="guest-field" style={{ flex: "0 1 125px" }}>
                          <label htmlFor={`amount-${request._id}`}>Amount (PKR)</label>
                          <input id={`amount-${request._id}`} type="number" min="0" step="1" value={charge.amount} onChange={(event) => setCharges((current) => ({ ...current, [request._id]: { ...charge, amount: event.target.value } }))} placeholder="0" />
                        </div>
                        <button className="guest-action-button" type="button" disabled={busyId === request._id || billedRequestIds.has(request._id)} onClick={() => addChargeAndInvoice(request)}>
                          {busyId === request._id ? <LoaderCircle className="animate-spin" size={14} /> : billedRequestIds.has(request._id) ? <CheckCircle2 size={14} /> : <CircleDollarSign size={14} />} {billedRequestIds.has(request._id) ? "Added to invoice" : "Add to invoice"}
                        </button>
                        {bookingId && <Link className="guest-action-button secondary" to={`/invoice/${bookingId}`}><ArrowUpRight size={14} /> View invoice</Link>}
                      </div>
                      <div className="service-request-task-assignment">
                        <div className="service-request-task-heading"><UsersRound size={16} /><strong>Assign a room task</strong></div>
                        <div className="service-request-task-buttons">
                          <button type="button" onClick={() => openAssignment(request, "housekeeping")} disabled={busyId === request._id}>Assign to Housekeeping</button>
                          <button type="button" onClick={() => openAssignment(request, "manager")} disabled={busyId === request._id}>Assign to Manager</button>
                        </div>
                        {assignment?.request._id === request._id && (
                          <form className="service-request-assignment-form" onSubmit={assignRequestTask}>
                            <div className="guest-field">
                              <label htmlFor={`task-assignee-${request._id}`}>Staff member</label>
                              <select id={`task-assignee-${request._id}`} value={assignment.assignedTo} onChange={(event) => setAssignment((current) => ({ ...current, assignedTo: event.target.value }))} required>
                                {staff.filter((person) => person.role === assignment.role).map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}
                              </select>
                            </div>
                            <div className="guest-field">
                              <label htmlFor={`task-remarks-${request._id}`}>Remarks for assignee</label>
                              <textarea id={`task-remarks-${request._id}`} value={assignment.remarks} onChange={(event) => setAssignment((current) => ({ ...current, remarks: event.target.value }))} maxLength={500} placeholder="Add instructions for the assigned staff member" />
                            </div>
                            <div className="service-request-assignment-actions">
                              <button className="guest-action-button" type="submit" disabled={busyId === request._id || !assignment.assignedTo}>{busyId === request._id ? <LoaderCircle className="animate-spin" size={14} /> : <CheckCircle2 size={14} />} Confirm assignment</button>
                              <button className="guest-action-button secondary" type="button" onClick={() => setAssignment(null)}>Cancel</button>
                            </div>
                            {!staff.some((person) => person.role === assignment.role) && <p className="service-request-no-staff">No active {assignment.role} staff are available.</p>}
                          </form>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : <div className="border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">There are no guest service requests yet.</div>}
          </div>
        </main>
      </div>
      <nav className="receptionist-request-mobile-nav" aria-label="Reception navigation">
        <Link to="/Manage-Bookings-By-Recep"><ClipboardList size={18} /><span>Bookings</span></Link>
        <Link to="/receptionist-service-requests" aria-current="page"><ConciergeBell size={18} /><span>Requests</span></Link>
      </nav>
    </div>
  );
}