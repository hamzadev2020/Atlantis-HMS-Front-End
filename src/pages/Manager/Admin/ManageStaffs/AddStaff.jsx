import axios from 'axios';
import React, { useState } from 'react';
import { Navbar } from "../../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../../Components/Admin/Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL;

export const AddStaff = () => {

    const [formData, setformData] = useState({
        name: "", email: "", role: ""
    });

    const [tempPassword, setTempPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleInput = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTempPassword('');
        setSubmitting(true);

        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.post(
                `${API_BASE}/user/staff`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTempPassword(response.data.tempPassword);
            setformData({ name: "", email: "", role: "" });

        } catch (err) {
            setError(err?.response?.data?.message || "Failed to add staff");
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
                    <div className="max-w-md mx-auto">

                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Add Staff</h1>
                        <p className="text-gray-500 mb-8">Create a new staff account</p>

                        {error && (
                            <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {tempPassword && (
                            <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-sm">
                                Staff created successfully. Temporary password:{" "}
                                <strong>{tempPassword}</strong>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full name"
                                    value={formData.name}
                                    onChange={handleInput}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="staff@example.com"
                                    value={formData.email}
                                    onChange={handleInput}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInput}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="manager">Manager</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="housekeeping">Housekeeping</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                            >
                                {submitting ? "Adding..." : "Add Staff"}
                            </button>
                        </form>

                    </div>
                </main>
            </div>
        </div>
    );
};