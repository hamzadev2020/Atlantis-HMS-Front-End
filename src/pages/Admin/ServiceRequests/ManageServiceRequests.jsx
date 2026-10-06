import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;
const isComplete = (status) => ["resolved", "completed", "closed"].includes(String(status || "").toLowerCase());

const ManageServiceRequests = () => {
  const [searchParams] = useSearchParams();
  const highlightedRequestId = searchParams.get("request");
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingRequest, setEditingRequest] = useState(null);
  const [form, setForm] = useState({
    type: "",
    description: "",
    status: "",
    escalatedToManager: false,
    escalationReason: ""
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    const requestHeaders = { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } };
    const refreshRequests = () => {
      axios.get(`${API_BASE}/service-requests`, requestHeaders).then((res) => {
        if (active) {
          setRequests(res.data.serviceRequests || []);
          setError("");
        }
      }).catch((err) => {
        if (active) setError(err?.response?.data?.message || "Failed to load service requests");
      }).finally(() => {
        if (active) setLoading(false);
      });
    };

    refreshRequests();
    const intervalId = window.setInterval(refreshRequests, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const openEdit = (req) => {
    setEditingRequest(req);
    setForm({
      type: req.type,
      description: req.description || "",
      status: req.status,
      escalatedToManager: req.escalatedToManager,
      escalationReason: req.escalationReason || ""
    });
  };

  const closeEdit = () => {
    setEditingRequest(null);
    setForm({
      type: "",
      description: "",
      status: "",
      escalatedToManager: false,
      escalationReason: ""
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`${API_BASE}/service-requests/${editingRequest._id}`, form, authHeaders);
      setRequests((prev) =>
        prev.map((r) => (r._id === editingRequest._id ? res.data.serviceRequest : r))
      );
      closeEdit();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (req) => setDeleteTarget(req);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/service-requests/${deleteTarget._id}`, authHeaders);
      setRequests((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      assigned: "bg-blue-100 text-blue-700",
      forwarded: "bg-indigo-100 text-indigo-700",
      "in-progress": "bg-violet-100 text-violet-700",
      resolved: "bg-green-100 text-green-700",
      completed: "bg-green-100 text-green-700",
      closed: "bg-green-100 text-green-700"
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || "bg-gray-100 text-gray-700"
          }`}
      >
        {status}
      </span>
    );
  };

  const typeBadge = (type) => {
    const styles = {
      "room-service": "bg-violet-100 text-violet-700",
      "wake-up-call": "bg-indigo-100 text-indigo-700",
      transport: "bg-blue-100 text-blue-700",
      maintenance: "bg-orange-100 text-orange-700",
      complaint: "bg-red-100 text-red-700"
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[type] || "bg-gray-100 text-gray-700"
          }`}
      >
        {type.replace("-", " ")}
      </span>
    );
  };

  const filteredRequests = requests.filter((r) => {
    const typeMatch = typeFilter === "all" || r.type === typeFilter;
    const statusMatch = statusFilter === "all" || r.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Service Requests</h1>
                <p className="text-gray-500 mt-1">View, update, and manage guest service requests</p>
              </div>
              <div className="bg-violet-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Total: {requests.length}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Types</option>
                <option value="room-service">Room Service</option>
                <option value="wake-up-call">Wake-up Call</option>
                <option value="transport">Transport</option>
                <option value="maintenance">Maintenance</option>
                <option value="complaint">Complaint</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="forwarded">Forwarded</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading service requests...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">{error}</div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No service requests found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-violet-600">
                      <tr>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Guest</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Room</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Type</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Description</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Status</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Manager escalation</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((req, idx) => {
                        const completedEscalation = req.escalatedToAdmin && isComplete(req.status);
                        return (
                          <tr
                            key={req._id}
                            className={`border-t border-gray-100 transition ${completedEscalation
                                ? "bg-emerald-50 ring-2 ring-inset ring-emerald-300"
                                : req._id === highlightedRequestId
                                  ? "bg-rose-50 ring-2 ring-inset ring-rose-300"
                                  : `hover:bg-violet-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`
                              }`}
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800">{req.guest?.name || "—"}</p>
                              <p className="text-xs text-gray-400">{req.guest?.email}</p>
                            </td>
                            <td className="px-5 py-4 text-gray-600">
                              {req.room ? `Room ${req.room.roomNumber}` : "—"}
                            </td>
                            <td className="px-5 py-4">{typeBadge(req.type)}</td>
                            <td className="px-5 py-4 text-gray-500 text-sm max-w-xs truncate">
                              {req.description || "—"}
                            </td>
                            <td className="px-5 py-4">{statusBadge(req.status)}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`text-xs font-semibold ${completedEscalation ? "text-emerald-700" : req.escalatedToAdmin ? "text-red-600" : "text-gray-400"
                                  }`}
                              >
                                {completedEscalation ? "Completed by Admin" : req.escalatedToAdmin ? "Sent to Admin" : "—"}
                              </span>
                              {req.escalatedToAdmin && <p className="mt-1 max-w-48 text-xs text-gray-500">{req.escalationToAdminReason}</p>}
                            </td>
                            <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => openEdit(req)}
                                className="px-4 py-1.5 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDelete(req)}
                                className="px-4 py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Edit Modal */}
          {editingRequest && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Service Request</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Guest: {editingRequest.guest?.name || "—"} · Room{" "}
                  {editingRequest.room?.roomNumber || "—"}
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="room-service">Room Service</option>
                      <option value="wake-up-call">Wake-up Call</option>
                      <option value="transport">Transport</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="forwarded">Forwarded</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="escalatedToManager"
                      checked={form.escalatedToManager}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-violet-600 rounded focus:ring-violet-500"
                    />
                    <label className="text-sm font-semibold text-gray-600">
                      Escalated to Manager
                    </label>
                  </div>

                  {form.escalatedToManager && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Escalation Reason
                      </label>
                      <textarea
                        name="escalationReason"
                        value={form.escalationReason}
                        onChange={handleFormChange}
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeEdit}
                      className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          {deleteTarget && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Service Request?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this request from{" "}
                  <span className="font-semibold text-gray-700">
                    {deleteTarget.guest?.name || "this guest"}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageServiceRequests;