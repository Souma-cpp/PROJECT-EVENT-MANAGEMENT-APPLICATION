/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        venue: "",
        date: null,
        duration: 1,
        thumbnail: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    "http://localhost:3000/api/organizers/create",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setVenues(response.data.data.venues);
            } catch (err) {
                console.error(err);
            }
        };

        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        if (roles[0] !== "organizer") {
            navigate("/");
            return;
        }

        fetchInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "thumbnail") {
            setForm({ ...form, thumbnail: files[0] });
            setThumbnailPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });

            await axios.post(
                "http://localhost:3000/api/organizers/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            toast.success("Event created successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white px-4">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-3xl flex flex-col gap-5"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Create Event
                </h2>

                <p className="text-gray-400 text-center text-sm md:text-base tracking-wide">
                    Organize your event with ease
                </p>

                {/* Name + Venue row */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Event Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            required
                            className="w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Venue</label>
                        <select
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                        >
                            <option value="">Select venue</option>
                            {venues.map((v) => (
                                <option key={v._id} value={v._id}>
                                    {v.name} – {v.location || "Unknown"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description"
                        rows="2"
                        required
                        className="text-xl w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition resize-none"
                    />
                </div>

                {/* Date + Duration row */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Event Date</label>
                        <DatePicker
                            selected={form.date}
                            onChange={(date) => setForm({ ...form, date })}
                            placeholderText="Select date"
                            className="w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition cursor-pointer"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Duration (hours)</label>
                        <input
                            type="number"
                            min="1"
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition"
                        />
                    </div>
                </div>

                {/* Thumbnail Upload */}
                {/* Thumbnail Upload */}
                {/* Thumbnail Upload with preview next to input */}
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        name="thumbnail"
                        onChange={handleChange}
                        className="flex-1 p-3 rounded-lg bg-neutral-950 border border-gray-700 text-white cursor-pointer"
                    />

                    {thumbnailPreview && (
                        <div className="w-24 h-24 rounded-lg border border-gray-600 overflow-hidden flex-shrink-0">
                            <img
                                src={thumbnailPreview}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 md:py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${loading
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
