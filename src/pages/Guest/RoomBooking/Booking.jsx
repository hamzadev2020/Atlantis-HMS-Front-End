
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GuestShell } from "../../../Components/Guest/GuestShell.jsx";
import "./myBookings.css";

const API_BASE = import.meta.env.VITE_API_URL;

export const Booking = () => {
    const api = `${API_BASE}/ManageBookings`;

    const { roomId } = useParams();

    const Token = sessionStorage.getItem("token");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, SetData] = useState({
        checkInDate: "",
        checkOutDate: "",
        phoneNumber: ""
    });

    // Local date (avoids UTC date shifting)
    const today = new Date();
    const minDate =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Calculate minimum checkout date
    const minCheckout = formData.checkInDate
        ? (() => {
            const date = new Date(
                formData.checkInDate + "T00:00:00"
            );
            date.setDate(date.getDate() + 1);

            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        })()
        : minDate;

    // Calculate total nights
    const totalNights =
        formData.checkInDate && formData.checkOutDate
            ? Math.round(
                (new Date(formData.checkOutDate + "T00:00:00") -
                    new Date(formData.checkInDate + "T00:00:00")) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    const handleInput = (e) => {
        const { name, value } = e.target;

        SetData((prev) => ({
            ...prev,
            [name]: value
        }));

        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.checkOutDate <= formData.checkInDate) {
            setMessage("Check-out date must be after check-in date.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const bookingData = {
                ...formData,
                room: roomId,
                bookingSource: "online"
            };

            const res = await axios.post(api, bookingData, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });

            setMessage(
                res.data.message || "Booking created successfully!"
            );

        } catch (e) {
            setMessage(
                e.response?.data?.message || e.message
            );
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <GuestShell>
            <div className="booking-page">

                {/* Page Heading */}
                <div className="booking-header">
                    <span className="booking-tag">
                        YOUR STAY, YOUR WAY
                    </span>

                    <h1>Reserve Your Stay</h1>

                    <p>
                        Choose your dates and get ready for
                        a comfortable hotel experience.
                    </p>
                </div>

                {/* Booking Progress */}
                <div className="booking-progress">
                    <div className="progress-step active">
                        <span>1</span>
                        <small>Select Dates</small>
                    </div>

                    <div className="progress-line"></div>

                    <div className="progress-step">
                        <span>2</span>
                        <small>Review Booking</small>
                    </div>

                    <div className="progress-line"></div>

                    <div className="progress-step">
                        <span>3</span>
                        <small>Confirmation</small>
                    </div>
                </div>

                <div className="booking-layout">

                    {/* Main Booking Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="booking-card"
                    >
                        <div className="card-heading">
                            <div>
                                <h2>Plan Your Stay</h2>
                                <p>
                                    Select your check-in and
                                    check-out dates.
                                </p>
                            </div>

                            <div className="calendar-icon">
                                <span>▦</span>
                            </div>
                        </div>

                        <div className="booking-divider"></div>

                        {/* Date Fields */}
                        <div className="date-grid">

                            <div className="form-group">
                                <label>
                                    CHECK-IN DATE
                                </label>

                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    min={minDate}
                                    onChange={(e) => {
                                        handleInput(e);

                                        // Reset checkout if invalid
                                        if (
                                            formData.checkOutDate &&
                                            e.target.value >=
                                            formData.checkOutDate
                                        ) {
                                            SetData((prev) => ({
                                                ...prev,
                                                checkInDate: e.target.value,
                                                checkOutDate: ""
                                            }));
                                        }
                                    }}
                                    required
                                />

                                <small>
                                    Arrival date
                                </small>
                            </div>

                            <div className="form-group">
                                <label>
                                    CHECK-OUT DATE
                                </label>

                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    min={minCheckout}
                                    onChange={handleInput}
                                    required
                                />

                                <small>
                                    Departure date
                                </small>
                            </div>
                            <div className="form-group">
                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}

                                    onChange={handleInput}
                                    required
                                />

                                <small>
                                    Phone Number
                                </small>
                            </div>

                        </div>

                        {/* Stay Duration */}
                        <div className="stay-info">
                            <span>☷</span>

                            {totalNights > 0
                                ? `${totalNights} ${totalNights === 1 ? "Night" : "Nights"} Stay`
                                : "Select dates to view your stay duration"}
                        </div>

                        <div className="booking-divider"></div>

                        {/* Booking Summary */}
                        <div className="booking-summary">
                            <h3>Booking Summary</h3>

                            <div className="summary-row">
                                <span>Check-in</span>

                                <strong>
                                    {formData.checkInDate || "Not selected"}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>Check-out</span>

                                <strong>
                                    {formData.checkOutDate || "Not selected"}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>Duration</span>

                                <strong>
                                    {totalNights > 0
                                        ? `${totalNights} Nights`
                                        : "—"}
                                </strong>
                            </div>
                        </div>

                        {/* Feedback Message */}
                        {message && (
                            <div className="booking-message">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="booking-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing Booking..."
                                : "Confirm Booking →"}
                        </button>

                        <p className="secure-note">
                            ♧ Your reservation details are
                            securely submitted.
                        </p>
                    </form>

                    {/* Right Side Information */}
                    <div className="booking-sidebar">

                        <div className="sidebar-card">
                            <div className="sidebar-top">
                                <span>YOUR RESERVATION</span>
                                <span className="status-badge">
                                    Online
                                </span>
                            </div>

                            <div className="hotel-placeholder">
                                <span>✦</span>
                                <h3>Your Stay</h3>
                                <p>
                                    A comfortable stay awaits you
                                </p>
                            </div>

                            <div className="sidebar-details">
                                <h3>Reservation Details</h3>

                                <div className="summary-row">
                                    <span>Room ID</span>
                                    <strong>
                                        {roomId || "—"}
                                    </strong>
                                </div>

                                <div className="summary-row">
                                    <span>Check-in</span>
                                    <strong>
                                        {formData.checkInDate || "—"}
                                    </strong>
                                </div>

                                <div className="summary-row">
                                    <span>Check-out</span>
                                    <strong>
                                        {formData.checkOutDate || "—"}
                                    </strong>
                                </div>

                                <div className="summary-row">
                                    <span>Total Nights</span>
                                    <strong>
                                        {totalNights || "—"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="help-card">
                            <span>NEED ASSISTANCE?</span>
                            <h3>We're here to help.</h3>
                            <p>
                                Review your reservation dates
                                before confirming your booking.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </GuestShell>
    );
};