/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../date.css"

const CreateEvent = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState(null);
    const [duration, setDuration] = useState(1);

    const fetchInformation = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            console.log(token);
            const response = await axios.get("http://localhost:3000/api/organizers/create", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log("the type is :", typeof (response.data.data.venues));
            setVenues(response.data.data.venues);
            setUser(response.data.data.user.name);
        } catch (error) {
            console.error("Error fetching organizer info:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const storedRoles = localStorage.getItem("roles");
        const roles = storedRoles ? JSON.parse(storedRoles) : [];
        const role = roles[0];

        if (role !== "organizer") {
            navigate("/");
            return;
        }
        fetchInformation();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = {
            name,
            description,
            venue,
            date: date ? date.toISOString() : null,
            duration,
        };

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post("http://localhost:3000/api/organizers/create", form, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            console.log(res.data)
            navigate("/dashboard");
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white px-4 relative">
            {/* Background radial gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 w-[90%] max-w-3xl flex flex-col gap-5"
            >
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Create an Event
                </h2>

                {/* Event Name */}
                <div className="flex flex-col gap-2 w-full sm:w-[90%] mx-auto">
                    <label htmlFor="name" className="text-sm text-gray-400">
                        Event Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={name}
                        placeholder="Enter event name"
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2 w-full sm:w-[90%] mx-auto">
                    <label htmlFor="description" className="text-sm text-gray-400">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        placeholder="Write a short event description"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="2"
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition resize-none text-base"
                    />
                </div>

                {/* Venue */}
                <div className="flex flex-col gap-2 w-full sm:w-[90%] mx-auto">
                    <label htmlFor="venue" className="text-sm text-gray-400">
                        Select Venue
                    </label>
                    <select
                        id="venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base"
                    >
                        <option value="">Choose your venue</option>
                        {venues.map((v) => (
                            <option key={v._id} value={v._id}>
                                {v.name} – {v.location || "Unknown Location"}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-2 w-full sm:w-[90%] mx-auto">
                    <label htmlFor="date" className="text-sm text-gray-400">
                        Event Date
                    </label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        placeholderText="Select event date"
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition cursor-pointer text-base"
                        dateFormat="dd MMM yyyy"
                    />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-2 w-full sm:w-[90%] mx-auto">
                    <label htmlFor="duration" className="text-sm text-gray-400">
                        Duration (hours)
                    </label>
                    <input
                        id="duration"
                        type="number"
                        min="1"
                        name="duration"
                        value={duration}
                        placeholder="Duration in hours"
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        className="w-full p-3 rounded-xl bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 sm:w-[90%] mx-auto  mt-2 rounded-xl font-semibold text-lg transition-all duration-200 
        ${loading
                            ? "bg-purple-900 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        }`}
                >
                    {loading ? "Creating Event..." : "Create Event"}
                </button>

                {error && (
                    <p className="text-red-500 text-center mt-1 text-sm">{error}</p>
                )}
            </form>
        </div>



    );
};

export default CreateEvent;
