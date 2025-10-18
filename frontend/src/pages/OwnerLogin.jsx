/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../utils/axios.js";

const OwnerLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("owner");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { email, password, roleIntent: role };

        try {
            const { accessToken, roles } = (
                await axios.post("http://localhost:3000/api/auth/login", data, {
                    withCredentials: true,
                })
            ).data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("roles", JSON.stringify(roles));
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black text-white px-4">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.1),transparent_40%)] pointer-events-none"></div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-3xl flex flex-col gap-6 transition-all duration-300"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-gray-400 text-center text-sm md:text-base tracking-wide">
                    Sign in to access your dashboard
                </p>

                {/* Two-column layout for Email + Password */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm md:text-base text-gray-400">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base md:text-lg"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm md:text-base text-gray-400">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full p-3 md:p-4 rounded-lg bg-neutral-950 border border-gray-700 focus:border-purple-500 outline-none text-white transition text-base md:text-lg"
                        />
                    </div>
                </div>

                {/* Role */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="role" className="text-sm md:text-base text-gray-400">
                        Role
                    </label>
                    <input
                        id="role"
                        type="text"
                        value={role}
                        disabled
                        className="w-full p-3 md:p-4 rounded-lg bg-neutral-900 border border-gray-800 text-gray-500 cursor-not-allowed text-base md:text-lg"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 md:py-4 rounded-lg font-semibold text-lg md:text-xl transition-all duration-200 ${loading
                        ? "bg-purple-900 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-gray-400 text-center text-sm md:text-base mt-2">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/ownerRegister")}
                        className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                    >
                        Register as a venue owner
                    </span>
                </p>
            </form>
        </div>
    );
};

export default OwnerLogin;
