/* eslint-disable no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isloggingOut, setisLoggingOut] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        const fetchDashboard = async () => {
            try {
                const res = await api.get("/auth/dashboard");
                setUserData(res.data);
                setProfileImage(res.data.avatar)
            } catch (err) {
                console.error(err);
                toast.error("Session expired. Please login again.");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate]);



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <p className="text-gray-400 text-lg">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-10 bg-black text-white">

            <button
                onClick={async () => {
                    setisLoggingOut(true);
                    try {
                        await api.post("/auth/logout", {}, { withCredentials: true });
                        localStorage.removeItem("accessToken");
                        delete api.defaults.headers.common["Authorization"];
                        toast.success("Logged out successfully!");
                        setLoggedOut(true);
                        navigate("/login");
                    } catch (err) {
                        console.error(err);
                        toast.error("Logout failed!");
                    } finally {
                        setisLoggingOut(false);
                    }
                }}
                className="absolute right-20 top-10 z-10 py-2 px-4 text-white bg-red-700 rounded-lg font-semibold cursor-pointer"
            >
                {isloggingOut ? "Logging Out..." : "Logout"}
            </button>



            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {userData ? (
                <div className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl shadow-lg">
                    <div className="w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Welcome, {userData.name}</h2>
                        <p className="text-gray-400 mb-2">Email: {userData.email}</p>
                        <p className="text-gray-400 mb-2">Roles: {userData.roles.join(", ")}</p>
                        <p className="text-gray-400 mb-2">Wallet: ${userData.walletAmount || 0}</p>
                        <p className="text-gray-400 mb-2">Reputation: {userData.reputation || "N/A"}</p>
                    </div>
                    <div className="">
                        <img
                            src={profileImage}
                            alt="user's profile picture"
                            onClick={() => navigate()}
                            className="cursor-pointer absolute top-30 right-20 h-10 w-10 rounded-full" />
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">No user data available</p>
            )}
        </div>
    );
};

export default Dashboard;
