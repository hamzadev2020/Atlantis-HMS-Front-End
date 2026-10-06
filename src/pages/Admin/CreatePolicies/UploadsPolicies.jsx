import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;

const UploadsPolicies = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [form, setForm] = useState({
    type: "privacy",
    Heading: "",
    Descriptions: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE}/policies`, form, authHeaders);
      setSuccess("Policy uploaded successfully");
      setForm({ type: "privacy", Heading: "", Descriptions: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload policy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-2xl mx-auto">

            <h1 className="text-3xl font-bold text-gray-800 mb-1">Upload Policy</h1>
            <p className="text-gray-500 mb-8">Add a new privacy, terms, or cancellation policy</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-sm">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg border border-violet-100 p-8 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="e.g. Guest Data Privacy"
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
                  onChange={handleChange}
                  rows="6"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/privacy-policy")}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 transition disabled:opacity-60"
                >
                  {submitting ? "Uploading..." : "Upload Policy"}
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadsPolicies;