/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom"
import api from "../utils/axios.js";

const LoginUser = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    // your Axios instance
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = { email, password, roleIntent: role };

        try {
            const { accessToken, roles } = (await axios.post(
                "http://localhost:3000/api/auth/login",
                data,
                { withCredentials: true }
            )).data;

            // store accessToken in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("roles", JSON.stringify(roles));

            // also set it in your Axios instance
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
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-neutral-900 border border-white/10 shadow-xl rounded-2xl p-12 w-full max-w-lg flex flex-col gap-8"
            >
                <h2 className="text-3xl font-semibold text-center">Login</h2>
                <h3 className="text-gray-400 text-lg text-center">Access your account</h3>

                {/* Email */}
                <div className="flex items-center gap-6">
                    <label htmlFor="email" className="text-xl w-36 text-gray-400 text-sm">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="text-xl flex-1 p-4 rounded-md bg-black border border-gray-700 focus:border-purple-500 outline-none transition text-lg"
                    />
                </div>

                {/* Password */}
                <div className="flex items-center gap-6">
                    <label htmlFor="password" className="text-xl w-36 text-gray-400 text-sm">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="text-xl flex-1 p-4 rounded-md bg-black border border-gray-700 focus:border-purple-500 outline-none transition text-lg"
                    />
                </div>

                {/* Role */}
                <div className="flex items-center gap-6">
                    <label htmlFor="role" className="text-xl w-36 text-gray-400 text-sm">Role</label>
                    <input
                        id="role"
                        type="text"
                        value={role}
                        disabled
                        className="text-xl flex-1 p-4 rounded-md bg-black border border-gray-700 text-gray-400 cursor-not-allowed text-lg"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full cursor-pointer py-4 rounded-md font-semibold text-lg transition 
            ${loading ? "bg-purple-900 text-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-gray-400 text-lg text-center mt-3">
                    Don't have an account ?{" "}
                    <a href="/register" className="text-xl text-purple-400 hover:text-purple-300">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
};

export default LoginUser;
