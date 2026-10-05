import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;

const ManagePolicies = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [editingPolicy, setEditingPolicy] = useState(null);
  const [form, setForm] = useState({ type: "", Heading: "", Descriptions: "" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_BASE, authHeaders);
      setPolicies(res.data.policies || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openEdit = (policy) => {
    setEditingPolicy(policy);
    setForm({
      type: policy.type,
      Heading: policy.Heading,
      Descriptions: policy.Descriptions
    });
  };

  const closeEdit = () => {
    setEditingPolicy(null);
    setForm({ type: "", Heading: "", Descriptions: "" });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/${editingPolicy._id}`, form, authHeaders);
      setPolicies((prev) =>
        prev.map((p) => (p._id === editingPolicy._id ? { ...p, ...form } : p))
      );
      closeEdit();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (policy) => setDeleteTarget(policy);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/${deleteTarget._id}`, authHeaders);
      setPolicies((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const typeBadge = (type) => {
    const styles = {
      privacy: "bg-violet-100 text-violet-700",
      terms: "bg-indigo-100 text-indigo-700",
      cancellation: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[type] || "bg-gray-100 text-gray-700"}`}>
        {type}
      </span>
    );
  };

  const filteredPolicies = policies.filter(
    (p) => typeFilter === "all" || p.type === typeFilter
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-5xl mx-auto">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Manage Policies</h1>
                <p className="text-gray-500 mt-1">View, update, and remove site policies</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-violet-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                  Total: {policies.length}
                </div>
                <button
                  onClick={() => navigate("/policies/upload")}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
                >
                  + Add Policy
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Types</option>
                <option value="privacy">Privacy</option>
                <option value="terms">Terms</option>
                <option value="cancellation">Cancellation</option>
              </select>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading policies...</div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">{error}</div>
            ) : filteredPolicies.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-white rounded-2xl shadow-lg border border-violet-100">
                No policies found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <div
                    key={policy._id}
                    className="bg-white rounded-2xl shadow-lg border border-violet-100 p-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {typeBadge(policy.type)}
                        <h3 className="text-lg font-bold text-gray-800">{policy.Heading}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(policy)}
                          className="px-4 py-1.5 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(policy)}
                          className="px-4 py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm whitespace-pre-line">
                      {policy.Descriptions}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editingPolicy && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Policy</h2>

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
                      <option value="privacy">Privacy</option>
                      <option value="terms">Terms</option>
                      <option value="cancellation">Cancellation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      name="Heading"
                      value={form.Heading}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      name="Descriptions"
                      value={form.Descriptions}
                      onChange={handleFormChange}
                      rows="6"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
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
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Policy?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">{deleteTarget.Heading}</span>?
                  This action cannot be undone.
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

export default ManagePolicies;