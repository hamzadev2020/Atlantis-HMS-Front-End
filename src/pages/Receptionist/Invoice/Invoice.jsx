import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./invoice.css";
const API_BASE = import.meta.env.VITE_API_URL;


const Invoice = () => {
    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const getInvoice = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE}/ManageBookings/${id}/invoice`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setInvoice(response.data.invoice);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getInvoice();
    }, [id]);

    if (loading) {
        return <h2 className="invoice-loading">Loading invoice...</h2>;
    }

    if (!invoice) {
        return <h2 className="invoice-loading">Invoice not found</h2>;
    }

    const servicesTotal = invoice.additionalServices.reduce(
        (total, service) => total + service.amount,
        0
    );

    return (
        <div className="invoice-page">

            <div className="invoice-container">

                {/* Header */}
                <div className="invoice-header">
                    <div>
                        <h1>HOTEL MANAGEMENT</h1>
                        <p>Guest Invoice</p>
                    </div>

                    <div className="invoice-title">
                        <h2>INVOICE</h2>
                        <p>#{invoice.bookingId}</p>
                    </div>
                </div>

                <hr />

                {/* Guest + Room */}
                <div className="invoice-info">

                    <div>
                        <h3>Guest Information</h3>
                        <p>
                            <strong>Name:</strong>{" "}
                            {invoice.guest?.name}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {invoice.guest?.email}
                        </p>
                    </div>

                    <div>
                        <h3>Room Information</h3>

                        <p>
                            <strong>Room:</strong>{" "}
                            {invoice.room?.roomNumber}
                        </p>

                        <p>
                            <strong>Type:</strong>{" "}
                            {invoice.room?.roomType}
                        </p>
                    </div>

                </div>

                {/* Stay Information */}
                <div className="stay-info">

                    <div>
                        <span>Check In</span>
                        <strong>
                            {new Date(
                                invoice.checkInDate
                            ).toLocaleDateString()}
                        </strong>
                    </div>

                    <div>
                        <span>Check Out</span>
                        <strong>
                            {new Date(
                                invoice.checkOutDate
                            ).toLocaleDateString()}
                        </strong>
                    </div>

                    <div>
                        <span>Total Nights</span>
                        <strong>
                            {invoice.totalNights}
                        </strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong className="status">
                            {invoice.status}
                        </strong>
                    </div>

                </div>

                {/* Charges */}
                <h3 className="charges-heading">
                    Billing Details
                </h3>

                <table className="invoice-table">

                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>
                                Room Charges
                                <small>
                                    {" "}({invoice.room?.pricePerNight} ×{" "}
                                    {invoice.totalNights} nights)
                                </small>
                            </td>

                            <td>
                                Rs. {invoice.roomCharges}
                            </td>
                        </tr>

                        {invoice.additionalServices.map(
                            (service, index) => (
                                <tr key={index}>
                                    <td>{service.serviceName}</td>

                                    <td>
                                        Rs. {service.amount}
                                    </td>
                                </tr>
                            )
                        )}

                        <tr className="subtotal-row">
                            <td>Services Total</td>
                            <td>Rs. {servicesTotal}</td>
                        </tr>

                        <tr>
                            <td>Tax (10%)</td>
                            <td>
                                Rs. {invoice.tax}
                            </td>
                        </tr>

                        <tr className="total-row">
                            <td>Total Amount</td>
                            <td>
                                Rs. {invoice.totalAmount}
                            </td>
                        </tr>

                    </tbody>

                </table>

                {/* Payment */}
                <div className="payment-section">

                    <div>
                        <strong>Payment Status:</strong>

                        <span
                            className={
                                invoice.paymentStatus === "paid"
                                    ? "paid"
                                    : "pending"
                            }
                        >
                            {invoice.paymentStatus}
                        </span>
                    </div>

                </div>

                {/* Buttons */}
                <div className="invoice-buttons">

                    <button
                        onClick={() => window.print()}
                        className="print-btn"
                    >
                        🖨 Print Invoice
                    </button>

                </div>

                <div className="invoice-footer">
                    <p>Thank you for staying with us!</p>
                </div>

            </div>

        </div>
    );
};

export default Invoice;


