import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../../../Components/Receptionist/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../../Components/Receptionist/Sidebar.jsx";

const API_BASE = `${import.meta.env.VITE_API_URL}/ManageBookings`;



const ManageBookingByRecep = () => {
  const token = sessionStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };


  const navigate = useNavigate();

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


  const [serviceBooking, setServiceBooking] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    amount: ""
  });
  const [addingService, setAddingService] = useState(false);

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
    const confirmCheckOut = window.confirm(
      "Are you sure you want to check out this guest?"
    );

    if (!confirmCheckOut) {
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

  const addService = async (e) => {
    e.preventDefault();

    setAddingService(true);

    try {
      const res = await axios.put(
        `${API_BASE}/${serviceBooking._id}/services`,
        serviceForm,
        authHeaders
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === serviceBooking._id
            ? res.data.booking
            : booking
        )
      );

      setServiceBooking(null);
      setServiceForm({
        serviceName: "",
        amount: ""
      });

      alert("Service added successfully");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add service");
    } finally {
      setAddingService(false);
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
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex min-h-[calc(100vh-73px)]">
        <Sidebar />

        <main className="flex-1 bg-slate-100 p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Bookings</h1>
                <p className="mt-1 text-sm text-slate-500">View, update, and manage room bookings</p>
              </div>

              <div className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
                Total: {bookings.length}
              </div>
            </div>

            <div className="mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-violet-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-in</option>
                <option value="checked-out">Checked-out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-12 text-center text-slate-500">Loading bookings...</div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">{error}</div>
              ) : filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-left">
                    <thead className="bg-violet-600">
                      <tr>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Guest</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Room</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Check-in</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Check-out</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Nights</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Source</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Status</th>
                        <th className="px-5 py-4 text-sm font-semibold text-white">Keys</th>
                        <th className="px-5 py-4 text-right text-sm font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, idx) => (
                        <tr
                          key={booking._id}
                          className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} border-t border-slate-200 align-top transition hover:bg-violet-50/60`}
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{booking.guest?.name || "—"}</div>
                            <div className="mt-1 text-xs text-slate-400">{booking.guest?.email}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            <div className="font-medium text-slate-700">Room {booking.room?.roomNumber || "—"}</div>
                            <div className="mt-1 text-xs text-slate-400">{booking.room?.roomType || "—"}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{formatDate(booking.checkInDate)}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{formatDate(booking.checkOutDate)}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{booking.totalNights}</td>
                          <td className="px-5 py-4 text-sm capitalize text-slate-600">{booking.bookingSource}</td>
                          <td className="px-5 py-4">{statusBadge(booking.status)}</td>
                          <td className="px-5 py-4 text-xs text-slate-600">
                            <div className="mb-1">Issued: {booking.keyIssued ? "Yes" : "No"}</div>
                            <div>Returned: {booking.keyReturned ? "Yes" : "No"}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap justify-end gap-2">
                              <button
                                onClick={() => openEdit(booking)}
                                className="rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmDelete(booking)}
                                className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-200"
                              >
                                Delete
                              </button>
                              {booking.status === "confirmed" && (
                                <button
                                  onClick={() => checkInBooking(booking._id)}
                                  className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                >
                                  Check In
                                </button>
                              )}
                              {booking.status === "checked-in" && (
                                <button
                                  onClick={() => checkOutBooking(booking._id)}
                                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                >
                                  Check Out
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setServiceBooking(booking);
                                  setServiceForm({
                                    serviceName: "",
                                    amount: ""
                                  });
                                }}
                                className="rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-200"
                              >
                                Add Service
                              </button>
                              <button
                                onClick={() => navigate(`/invoice/${booking._id}`)}
                                className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-200"
                              >
                                View Invoice
                              </button>
                            </div>
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
          {serviceBooking && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  Add Additional Service
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                  Guest: {serviceBooking.guest?.name || "—"}
                  {" · "}
                  Room {serviceBooking.room?.roomNumber || "—"}
                </p>

                <form onSubmit={addService} className="space-y-4">

                  {/* Service Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Service
                    </label>

                    <select
                      value={serviceForm.serviceName}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          serviceName: e.target.value
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    >
                      <option value="">Select Service</option>
                      <option value="Food">Food</option>
                      <option value="Laundry">Laundry</option>
                      <option value="Transport">Transport</option>
                      <option value="Room Service">Room Service</option>
                      <option value="Extra Bed">Extra Bed</option>
                      <option value="Wake-up Call">Wake-up Call</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={serviceForm.amount}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          amount: e.target.value
                        })
                      }
                      placeholder="Enter amount"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">

                    <button
                      type="button"
                      onClick={() => setServiceBooking(null)}
                      className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={addingService}
                      className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 disabled:opacity-60"
                    >
                      {addingService ? "Adding..." : "Add Service"}
                    </button>

                  </div>

                </form>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageBookingByRecep;