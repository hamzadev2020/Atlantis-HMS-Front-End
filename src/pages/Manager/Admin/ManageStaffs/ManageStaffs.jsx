import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API = import.meta.env.VITE_API_URL;
const API_BASE = `${API}/user/staffs`;

const ManageStaffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "", isActive: true, Remarks: "" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchStaffs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/user/staffs`, authHeaders);
      setStaffs(res.data.staffs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load staff");
    } finally {
      setLoading(false);staffs
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const openEdit = (staff) => {
    setEditingStaff(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
      Remarks: staff.Remarks || ""
    });
  };

  const closeEdit = () => {
    setEditingStaff(null);
    setForm({ name: "", email: "", role: "", isActive: true, Remarks: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/${editingStaff._id}`, form, authHeaders);
      setStaffs((prev) =>
        prev.map((s) => (s._id === editingStaff._id ? { ...s, ...form } : s))
      );
      closeEdit();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (staff) => setDeleteTarget(staff);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/${deleteTarget._id}`, authHeaders);
      setStaffs((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const roleBadge = (role) => {
    const styles = {
      manager: "bg-purple-100 text-purple-700",
      receptionist: "bg-indigo-100 text-indigo-700",
      housekeeping: "bg-fuchsia-100 text-fuchsia-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          styles[role] || "bg-gray-100 text-gray-700"
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Staffs</h1>
                <p className="text-gray-500 mt-1">View, update, and remove staff accounts</p>
              </div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Total: {staffs.length}
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">

              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading staff...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">{error}</div>
              ) : staffs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No staff members found.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-purple-600">
                    <tr>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Name</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Email</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Role</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Remarks</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Temp Password</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm">Status</th>
                      <th className="px-6 py-4 text-white font-semibold text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffs.map((staff, idx) => (
                      <tr
                        key={staff._id}
                        className={`border-t border-gray-100 hover:bg-purple-50 transition ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">{staff.name}</td>
                        <td className="px-6 py-4 text-gray-600">{staff.email}</td>
                        <td className="px-6 py-4">{roleBadge(staff.role)}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {staff.Remarks || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs bg-gray-100 text-gray-700 rounded px-2 py-1">
                            {staff.tempPassword || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              staff.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {staff.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEdit(staff)}
                            className="px-4 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(staff)}
                            className="px-4 py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Edit Modal */}
          {editingStaff && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Staff</h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="manager">Manager</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="housekeeping">Housekeeping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                    <select
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

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
                      className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
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
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Staff?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">{deleteTarget.name}</span>? This
                  action cannot be undone.
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

export default ManageStaffs;