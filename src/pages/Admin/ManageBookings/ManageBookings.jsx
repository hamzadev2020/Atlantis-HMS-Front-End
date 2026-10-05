import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;



const ViewBookings = () => {
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [editingBooking, setEditingBooking] = useState(null);
  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    actualCheckIn: "",
    actualCheckOut: "",
    bookingSource: "",
    status: "",
    keyIssued: false,
    keyReturned: false
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_BASE, authHeaders);
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const toDateInput = (dateStr) => (dateStr ? dateStr.slice(0, 10) : "");

  const openEdit = (booking) => {
    setEditingBooking(booking);
    setForm({
      checkInDate: toDateInput(booking.checkInDate),
      checkOutDate: toDateInput(booking.checkOutDate),
      actualCheckIn: toDateInput(booking.actualCheckIn),
      actualCheckOut: toDateInput(booking.actualCheckOut),
      bookingSource: booking.bookingSource,
      status: booking.status,
      keyIssued: booking.keyIssued,
      keyReturned: booking.keyReturned
    });
  };

  const closeEdit = () => {
    setEditingBooking(null);
    setForm({
      checkInDate: "",
      checkOutDate: "",
      actualCheckIn: "",
      actualCheckOut: "",
      bookingSource: "",
      status: "",
      keyIssued: false,
      keyReturned: false
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
      const payload = {
        ...form,
        actualCheckIn: form.actualCheckIn || null,
        actualCheckOut: form.actualCheckOut || null
      };
      const res = await axios.put(`${API_BASE}/${editingBooking._id}`, payload, authHeaders);
      setBookings((prev) =>
        prev.map((b) => (b._id === editingBooking._id ? res.data.booking : b))
      );
      closeEdit();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (booking) => setDeleteTarget(booking);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE}/${deleteTarget._id}`, authHeaders);
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-700",
      "checked-in": "bg-green-100 text-green-700",
      "checked-out": "bg-slate-200 text-slate-700",
      cancelled: "bg-red-100 text-red-700"
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


  const checkInBooking = async (bookingId) => {
    const confirmCheckIn = window.confirm(
      "Are you sure you want to check in this guest?"
    );

    if (!confirmCheckIn) {
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE}/${bookingId}/check-in`,
        {},
        authHeaders
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? res.data.booking
            : booking
        )
      );

    } catch (err) {
      alert(err?.response?.data?.message || "Check-in failed");
    }
  };


  const checkOutBooking = async (bookingId) => {
    const confirmCheckIn = window.confirm(
      "Are you sure you want to check Out in this guest?"
    );

    if (!confirmCheckIn) {
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE}/${bookingId}/check-out`,
        {},
        authHeaders
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? res.data.booking
            : booking
        )
      );

    } catch (err) {
      alert(err?.response?.data?.message || "Check-Out failed");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  const filteredBookings = bookings.filter(
    (b) => statusFilter === "all" || b.status === statusFilter
  );

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
                <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
                <p className="text-gray-500 mt-1">View, update, and manage room bookings</p>
              </div>
              <div className="bg-violet-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Total: {bookings.length}
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-3 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-in</option>
                <option value="checked-out">Checked-out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-violet-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">Loading bookings...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">{error}</div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-violet-600">
                      <tr>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Guest</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Room</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Check-in</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Check-out</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Nights</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Source</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Status</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm">Keys</th>
                        <th className="px-5 py-4 text-white font-semibold text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, idx) => (
                        <tr
                          key={booking._id}
                          className={`border-t border-gray-100 hover:bg-violet-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                            }`}
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {booking.guest?.name || "—"}
                            </p>
                            <p className="text-xs text-gray-400">{booking.guest?.email}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            {booking.room ? `Room ${booking.room.roomNumber} (${booking.room.roomType})` : "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-600">{formatDate(booking.checkInDate)}</td>
                          <td className="px-5 py-4 text-gray-600">{formatDate(booking.checkOutDate)}</td>
                          <td className="px-5 py-4 text-gray-600">{booking.totalNights}</td>
                          <td className="px-5 py-4 text-gray-600 capitalize">{booking.bookingSource}</td>
                          <td className="px-5 py-4">{statusBadge(booking.status)}</td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            Issued: {booking.keyIssued ? "Yes" : "No"}<br />
                            Returned: {booking.keyReturned ? "Yes" : "No"}
                          </td>
                          <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openEdit(booking)}
                              className="px-4 py-1.5 rounded-lg bg-violet-100 text-violet-700 font-semibold hover:bg-violet-200 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(booking)}
                              className="px-4 py-1.5 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => checkInBooking(booking._id)}
                                className="px-4 py-1.5 rounded-lg bg-green-100 text-green-700 font-semibold"
                              >
                                Check In
                              </button>

                            )}

                            {booking.status === "checked-in" && (
                              <button
                              onClick={()=>checkOutBooking(booking._id)}
                              className="px-4 py-1.5 rounded-lg bg-green-100 text-grey-700 font-semibolds">
                                Check Out
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Edit Modal */}
          {editingBooking && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Booking</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Guest: {editingBooking.guest?.name || "—"} · Room{" "}
                  {editingBooking.room?.roomNumber || "—"}
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={form.checkInDate}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={form.checkOutDate}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Actual Check-in
                      </label>
                      <input
                        type="date"
                        name="actualCheckIn"
                        value={form.actualCheckIn}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Actual Check-out
                      </label>
                      <input
                        type="date"
                        name="actualCheckOut"
                        value={form.actualCheckOut}
                        onChange={handleFormChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Booking Source
                    </label>
                    <select
                      name="bookingSource"
                      value={form.bookingSource}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="online">Online</option>
                      <option value="walk-in">Walk-in</option>
                      <option value="phone">Phone</option>
                    </select>
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
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked-in</option>
                      <option value="checked-out">Checked-out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="keyIssued"
                        checked={form.keyIssued}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                      <label className="text-sm font-semibold text-gray-600">Key Issued</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="keyReturned"
                        checked={form.keyReturned}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                      <label className="text-sm font-semibold text-gray-600">Key Returned</label>
                    </div>
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
                <h2 className="text-lg font-bold text-gray-800 mb-2">Delete Booking?</h2>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this booking for{" "}
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

export default ViewBookings;