import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";
import { uploadImage } from "../../../config/cloudinary.js";

const API_BASE = import.meta.env.VITE_API_URL;

const ManageRooms = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    roomType: "",
    pricePerNight: "",
    capacity: "",
    description: "",
    images: "",
    status: "",
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/ManageRooms`, authHeaders);
      setRooms(res.data.rooms || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      description: room.description || "",
      images: (room.images || []).join(", "),
      status: room.status,
      isActive: room.isActive
    });
  };

  const closeEdit = () => {
    setEditingRoom(null);
    setForm({
      roomType: "",
      pricePerNight: "",
      capacity: "",
      description: "",
      images: "",
      status: "",
      isActive: true
    });
    setImageFiles([]);
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
      const uploadedImages = await Promise.all(imageFiles.map(uploadImage));
      const payload = {
        ...form,
        images: [
          ...form.images.split(",").map((url) => url.trim()).filter(Boolean),
          ...uploadedImages
        ],
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity)
      };
      await axios.put(`${API_BASE}/${editingRoom._id}`, payload, authHeaders);
      setRooms((prev) =>
        prev.map((r) => (r._id === editingRoom._id ? { ...r, ...payload } : r))
      );
      closeEdit();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (room) => setDeleteTarget(room);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/${deleteTarget._id}`, authHeaders);
      setRooms((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      available: "bg-green-100 text-green-700",
      occupied: "bg-red-100 text-red-700",
      cleaning: "bg-yellow-100 text-yellow-700",
      maintenance: "bg-gray-200 text-gray-700",
      unavailable: "bg-slate-200 text-slate-700"
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const typeBadge = (type) => {
    const styles = {
      Standard: "bg-purple-100 text-purple-700",
      Deluxe: "bg-indigo-100 text-indigo-700",
      Suite: "bg-fuchsia-100 text-fuchsia-700",
      Executive: "bg-violet-100 text-violet-700"
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[type] || "bg-gray-100 text-gray-700"
        }`}
      >
        {type}
      </span>
    );
  };

  const filteredRooms = rooms.filter((r) => {
    const typeMatch = typeFilter === "all" || r.roomType === typeFilter;
    const statusMatch = statusFilter === "all" || r.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
                <p className="text-gray-500 mt-1">View, update, and manage all hotel rooms</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                  Total: {rooms.length}
                </div>
                <button
                  onClick={() => navigate("/rooms/upload")}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  + Add Room
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Executive">Executive</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading rooms...</div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">{error}</div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-white rounded-2xl shadow-lg border border-purple-100">
                No rooms found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="h-40 bg-purple-50 flex items-center justify-center overflow-hidden">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={room.images[0]}
                          alt={`Room ${room.roomNumber}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-purple-300 text-sm font-semibold">
                          No Image
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Room {room.roomNumber}
                        </h3>
                        {typeBadge(room.roomType)}
                      </div>

                      <p className="text-purple-600 font-bold text-xl mb-2">
                        ${room.pricePerNight}
                        <span className="text-gray-400 text-sm font-normal"> / night</span>
                      </p>

                      <p className="text-gray-500 text-sm mb-3">
                        Capacity: {room.capacity} guest{room.capacity > 1 ? "s" : ""}
                      </p>

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {room.description || "No description provided"}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        {statusBadge(room.status)}
                        <span
                          className={`text-xs font-semibold ${
                            room.isActive ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {room.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(room)}
                          className="flex-1 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(room)}
                          className="flex-1 px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editingRoom && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Edit Room {editingRoom.roomNumber}
                </h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Room Type
                    </label>
                    <select
                      name="roomType"
                      value={form.roomType}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Price / Night
                      </label>
                      <input
                        type="number"
                        name="pricePerNight"
                        value={form.pricePerNight}
                        onChange={handleFormChange}
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
                        onChange={handleFormChange}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Room images</label>
                    {editingRoom.images?.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {editingRoom.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Room ${editingRoom.roomNumber} ${index + 1}`} className="h-14 w-20 rounded-lg object-cover" />)}
                      </div>
                    )}
                    <input type="text" name="images" value={form.images} onChange={handleFormChange} placeholder="Image URLs, separated by commas" aria-label="Room image URLs" className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
                    <input type="file" accept="image/*" multiple onChange={(event) => setImageFiles(Array.from(event.target.files || []))} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm" />
                    <p className="mt-1 text-xs text-gray-500">Choose additional images to upload · max 10 MB each</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label className="text-sm font-semibold text-gray-600">
                      Room is Active
                    </label>
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
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Room?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    Room {deleteTarget.roomNumber}
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

export default ManageRooms;