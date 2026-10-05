import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL;


export const ReceptionistDashboard = () => {

  const token = sessionStorage.getItem("token");

  const roomApi = `${API_BASE}/ManageRooms`;
  const bookingApi = `${API_BASE}/ManageBookings`;

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    const getRooms = async () => {
      try {
        const res = await axios.get(roomApi, authHeaders);
        setRooms(res.data.rooms);
      } catch (error) {
        console.log(error.message);
      }
    }

    const getBookings = async () => {
      try {
        const res = await axios.get(bookingApi, authHeaders);
        setBookings(res.data.bookings);
      } catch (error) {
        console.log(error.message);
      }
    }

    getRooms();
    getBookings();

  }, []);

  // -----------------------------
  // DASHBOARD COUNTS
  // -----------------------------

  const totalRooms = rooms.length;

  const occupiedRooms = bookings.filter(
    booking => booking.status === "checked-in"
  ).length;

  const availableRooms = rooms.filter(
    room => room.status === "available"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const todayCheckIns = bookings.filter(
    booking =>
      booking.status === "confirmed" &&
      booking.checkInDate?.split("T")[0] === today
  ).length;

  const todayCheckOuts = bookings.filter(
    booking =>
      booking.status === "checked-in" &&
      booking.checkOutDate?.split("T")[0] === today
  ).length;


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Receptionist Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage hotel bookings and daily guest activities
          </p>
        </div>

        <button
          onClick={() => navigate('/Manage-Bookings-By-Recep')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          Manage Bookings
        </button>

      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Rooms */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Total Rooms
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalRooms}
              </h2>
            </div>

            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
              🏨
            </div>

          </div>

        </div>


        {/* Available */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Available Rooms
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {availableRooms}
              </h2>
            </div>

            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
              ✓
            </div>

          </div>

        </div>


        {/* Occupied */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Occupied Rooms
              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {occupiedRooms}
              </h2>
            </div>

            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">
              👤
            </div>

          </div>

        </div>


        {/* Today's Check-ins */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Today's Check-ins
              </p>

              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                {todayCheckIns}
              </h2>
            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
              ↓
            </div>

          </div>

        </div>

      </div>


      {/* Today's Check-out */}
      <div className="mt-6">

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-sm">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-500 text-sm">
                Today's Check-outs
              </p>

              <h2 className="text-3xl font-bold text-orange-600 mt-2">
                {todayCheckOuts}
              </h2>
            </div>

            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl">
              ↑
            </div>

          </div>

        </div>

      </div>


      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <button
          onClick={() => navigate('/Manage-Bookings-By-Recep')}
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          View & Manage Bookings
        </button>

      </div>

    </div>
  )
}