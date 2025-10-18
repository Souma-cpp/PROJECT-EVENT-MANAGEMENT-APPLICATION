/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        roleIntent: "user",
        avatar: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            setForm({ ...form, avatar: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("password", form.password);
            formData.append("roleIntent", form.roleIntent);
            if (form.avatar) formData.append("avatar", form.avatar);

            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success(response.data.msg || "Registered successfully!");
            setForm({ name: "", email: "", password: "", roleIntent: "user", avatar: null });
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white px-4 relative overflow-hidden">
            {/* Soft radial glow background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-3xl flex flex-col gap-6 transition-all duration-300"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Create an Account
                </h1>
                <p className="text-gray-400 text-center text-sm md:text-base tracking-wide">
                    Join the platform and start exploring
                </p>

                {/* Name and Email */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm md:text-base text-gray-400">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base md:text-lg"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm md:text-base text-gray-400">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base md:text-lg"
                        />
                    </div>
                </div>

                {/* Password and Role */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm md:text-base text-gray-400">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base md:text-lg"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="roleIntent" className="text-sm md:text-base text-gray-400">Role</label>
                        <input
                            id="roleIntent"
                            name="roleIntent"
                            type="text"
                            value={form.roleIntent}
                            disabled
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-900 border border-gray-800 text-gray-500 cursor-not-allowed text-base md:text-lg"
                        />
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="avatar" className="text-sm md:text-base text-gray-400">Avatar (optional)</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-2 md:p-3 rounded-lg bg-neutral-950 border border-gray-700 text-white cursor-pointer"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 md:py-4 rounded-lg font-semibold text-lg md:text-xl transition-all duration-200 ${loading ? "bg-purple-900 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        }`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-gray-400 text-center text-sm md:text-base mt-2">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default RegisterUser;
