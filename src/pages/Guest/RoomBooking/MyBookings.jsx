import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './myBookings.css';
import { Navbar } from '../../../Components/Admin/Navbar';

export const GuestBooking = () => {

  const token = sessionStorage.getItem("token");
  const settoken = "Bearer " + token;

  axios.defaults.headers.common.Authorization = settoken;

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  // Details popup
  const [bookingDetails, setDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Cancel popup
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkCancel, setCencel] = useState(false);


  const getBookings = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/ManageBookings/my-bookings"
      );

      setBookings(res.data.bookings);

    } catch (e) {
      setMessage(e.message);
    }
  };


  const checkDetail = async (id) => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/ManageBookings/${id}`
      );

      setDetails(res.data.booking);
      setShowPopup(true);

    } catch (error) {

      setMessage(
        error.response?.data?.message || error.message
      );

    }
  };


  const cencelBooking = async (bookingId) => {

    try {

      await axios.post(
        `http://localhost:5000/api/ManageBookings/cencelbooking/${bookingId}`
      );

      setMessage("Booking Has Been Canceled");

      // popup close
      setCencel(false);

      // selected booking clear
      setSelectedBooking(null);

      // bookings refresh
      getBookings();

    } catch (e) {

      setMessage(
        e.response?.data?.message || e.message
      );

    }
  };


  useEffect(() => {
    getBookings();
  }, []);


  return (
    <>
      <Navbar />

      <table className="booking-table">

        <thead>
          <tr>
            <th>Image</th>
            <th>Booking ID</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Actual Check-in</th>
            <th>Actual Check-out</th>
            <th>Nights</th>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Room Price</th>
            <th>Actions</th>
          </tr>
        </thead>


        <tbody>

          {bookings.map((b) => (

            <tr key={b._id}>

              {/* Image */}
              <td>
                <img
                  src={b.room?.images?.[0]}
                  width={60}
                  height={45}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                  alt="Room"
                />
              </td>


              {/* Booking ID */}
              <td>{b._id}</td>


              {/* Check-in */}
              <td>
                {b.checkInDate
                  ? new Date(b.checkInDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "-"
                }
              </td>


              {/* Check-out */}
              <td>
                {b.checkOutDate
                  ? new Date(b.checkOutDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "-"
                }
              </td>


              {/* Actual Check-in */}
              <td>
                {b.actualCheckIn
                  ? new Date(b.actualCheckIn).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "-"
                }
              </td>


              {/* Actual Check-out */}
              <td>
                {b.actualCheckOut
                  ? new Date(b.actualCheckOut).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "-"
                }
              </td>


              {/* Nights */}
              <td>{b.totalNights}</td>


              {/* Room Number */}
              <td>{b.room?.roomNumber}</td>


              {/* Room Type */}
              <td>{b.room?.roomType}</td>


              {/* Room Price */}
              <td>{b.room?.pricePerNight}</td>


              {/* View Details */}
              <td>

                <button
                  onClick={() => checkDetail(b._id)}
                >
                  View Details
                </button>


                {/* Cancel Booking */}
                {b.status === "confirmed" && (

                  <button
                    onClick={() => {

                      setSelectedBooking(b);
                      setCencel(true);

                    }}
                  >
                    Cancel Booking
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>


      {/* =========================
          DETAILS POPUP
      ========================= */}

      {showPopup && bookingDetails && (

        <div className="modal-overlay">

          <div className="booking-modal">

            <button
              className="close-btn"
              onClick={() => setShowPopup(false)}
            >
              X
            </button>


            <h2>Booking Details</h2>

            <p>
              Booking ID: {bookingDetails._id}
            </p>

            <p>
              Room Number: {bookingDetails.room.roomNumber}
            </p>

            <p>
              Room Type: {bookingDetails.room.roomType}
            </p>

            <p>
              Check-in: {bookingDetails.checkInDate}
            </p>

            <p>
              Check-out: {bookingDetails.checkOutDate}
            </p>

            <p>
              Total Nights: {bookingDetails.totalNights}
            </p>

            <p>
              Price Per Night: {
                bookingDetails.room.pricePerNight
              }
            </p>

            <p>
              Status: {bookingDetails.status}
            </p>

          </div>

        </div>

      )}


      {/* =========================
          CANCEL POPUP
      ========================= */}

      {checkCancel && selectedBooking && (

        <div className="overlay">

          <div className="popup">

            <h3>
              Cancel Booking?
            </h3>

            <p>
              Are you sure you want to cancel this booking?
            </p>

            <button
              onClick={() => {

                setCencel(false);
                setSelectedBooking(null);

              }}
            >
              Cancel
            </button>


            <button
              onClick={() => {

                cencelBooking(
                  selectedBooking._id
                );

              }}
            >
              Yes, Cancel Booking
            </button>

          </div>

        </div>

      )}


    </>
  );
};