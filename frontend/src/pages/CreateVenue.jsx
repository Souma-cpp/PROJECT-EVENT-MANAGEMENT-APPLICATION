/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../date.css";
const CreateVenue = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [rate, setRate] = useState("");
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log(token);
            const response = await axios.get("http://localhost:3000/api/owners/create", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setUser({
                username: response.data.data.name,
                role: response.data.data.roles[0],
                email: response.data.data.email,
                verified: response.data.data.isVerified,
            });
        } catch (error) {
            console.log("Error while fetching user info:", error);
            toast.error("Session expired or unauthorized.");
            navigate("/");
        }
    };

    useEffect(() => {
        //console.log(localStorage.getItem("accessToken"));
        const storedRoles = localStorage.getItem("roles");
        const roles = storedRoles ? JSON.parse(storedRoles) : [];
        const role = roles[0];

        if (role !== "owner") {
            navigate("/");
            return;
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = {
            name,
            location,
            capacity,
            pricePerHour: rate,
            availableFrom: from?.toISOString(),
            availableTo: to?.toISOString(),
        };

        try {
            await axios.post("http://localhost:3000/api/owners/create", form, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            toast.success("Venue created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error while submitting form:", error);
            toast.error(error.response?.data?.msg || "Failed to create venue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white px-4 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 w-full max-w-2xl flex flex-col gap-6 transition-all duration-300"
            >
                <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    List Your Venue
                </h2>
                <p className="text-gray-400 text-center text-sm tracking-wide">
                    Help organizers discover and book your property
                </p>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Venue Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g., Skyline Banquet Hall"
                        required
                        className="text-xl  w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Street or Landmark"
                        required
                        className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Capacity</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="Max guests"
                            required
                            className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Rate (₹/hour)</label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="Enter rate"
                            required
                            className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                        />
                    </div>
                </div>

                {/* Date Picker Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Available From</label>
                        <DatePicker
                            selected={from}
                            onChange={(date) => setFrom(date)}
                            placeholderText="Select start date"
                            className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Available Until</label>
                        <DatePicker
                            selected={to}
                            onChange={(date) => setTo(date)}
                            placeholderText="Select end date"
                            className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 
            ${loading
                            ? "bg-purple-900 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        }`}
                >
                    {loading ? "Creating Venue..." : "Create Venue"}
                </button>
            </form>
        </div>
    );
};

export default CreateVenue;
