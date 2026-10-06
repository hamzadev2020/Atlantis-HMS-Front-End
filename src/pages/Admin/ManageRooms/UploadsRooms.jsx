import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";
import { uploadImage } from "../../../config/cloudinary.js";

const API_BASE = import.meta.env.VITE_API_URL;

const UploadsRooms = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Standard",
    pricePerNight: "",
    capacity: "",
    description: "",
    images: "",
    status: "available",
    isActive: true
  });

  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const generateRoomId = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/ManageRooms`, authHeaders);
      const rooms = res.data.rooms || [];

      const numbers = rooms
        .map((r) => parseInt(r.roomNumber, 10))
        .filter((n) => !isNaN(n));

      const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 101;

      setForm((prev) => ({ ...prev, roomNumber: String(next) }));
    } catch (err) {
      setError(err?.response?.data?.message || "Room ID generate nahi ho saka");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.roomNumber || !form.roomType || !form.pricePerNight || !form.capacity) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const uploadedImages = await Promise.all(imageFiles.map(uploadImage));
      const payload = {
        roomNumber: form.roomNumber,
        roomType: form.roomType,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        description: form.description,
        images: form.images
          ? [...form.images.split(",").map((url) => url.trim()).filter(Boolean), ...uploadedImages]
          : uploadedImages,
        status: form.status,
        isActive: form.isActive
      };

      await axios.post(`${API_BASE}/ManageRooms`, payload, authHeaders);
      setSuccess("Room uploaded successfully");

      setForm({
        roomNumber: "",
        roomType: "Standard",
        pricePerNight: "",
        capacity: "",
        description: "",
        images: "",
        status: "available",
        isActive: true
      });
      setImageFiles([]);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Room upload failed");
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

            <h1 className="text-3xl font-bold text-gray-800 mb-1">Upload Room</h1>
            <p className="text-gray-500 mb-8">Add a new room to the hotel inventory</p>

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
              className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-5"
            >

              {/* Room Number + Generate button */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Room Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. 101"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRoomId}
                    disabled={generating}
                    className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition disabled:opacity-60 whitespace-nowrap"
                  >
                    {generating ? "Generating..." : "Generate Room ID"}
                  </button>
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              {/* Price + Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Price Per Night
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={form.pricePerNight}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Room images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">{imageFiles.length} image{imageFiles.length === 1 ? "" : "s"} selected · maximum 10 MB each</p>
                <input
                  type="text"
                  name="images"
                  value={form.images}
                  onChange={handleChange}
                  placeholder="Or paste image URLs separated by commas"
                  aria-label="Optional image URLs, comma separated"
                  className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* isActive */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-semibold text-gray-600">
                  Room is Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/rooms")}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                >
                  {submitting ? "Uploading..." : "Upload Room"}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadsRooms;