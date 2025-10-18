import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { toast } from "react-hot-toast";
//import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    //const [events, setEvents] = useState([]);

    // useEffect(() => {
    //       const fetchEvents = async () => {
    //           try {
    //               const res = await axios.get("http://localhost:3000/api/organizers/events");
    //               console.log(res.data.data);
    //               setEvents(res.data.data);
    //           } catch (err) {
    //               console.error(err);
    //           }
    //       };

    //     //fetchEvents();
    // }, []);

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
                setProfileImage(res.data.avatar);
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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            localStorage.removeItem("accessToken");
            delete api.defaults.headers.common["Authorization"];
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error("Logout failed!");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen p-10 bg-black text-white">
            <button
                onClick={handleLogout}
                className="absolute right-10 top-10 z-10 py-2 px-4 text-white bg-red-700 rounded-lg font-semibold"
            >
                {isLoggingOut ? "Logging Out..." : "Logout"}
            </button>

            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {userData ? (
                <div className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl shadow-lg mb-6">
                    <div className="w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Welcome, {userData.name}</h2>
                        <p className="text-gray-400 mb-2">Email: {userData.email}</p>
                        <p className="text-gray-400 mb-2">
                            Roles: {userData.roles ? userData.roles.join(", ") : "N/A"}
                        </p>
                        <p className="text-gray-400 mb-2">Wallet: ${userData.walletAmount || 0}</p>
                        <p className="text-gray-400 mb-2">Reputation: {userData.reputation || "N/A"}</p>
                    </div>
                    <div className="flex items-center justify-end">
                        {profileImage && (
                            <img
                                src={profileImage}
                                alt="profile"
                                className="h-10 w-10 rounded-full cursor-pointer"
                            />
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">No user data available right now</p>
            )}

            {/* <div>
                {events.length > 0 ? (
                    <ul className="flex flex-wrap gap-4">
                        {events.map((event) => (
                            <li key={event._id} className="h-40 w-80 rounded-2xl overflow-hidden bg-neutral-800 flex flex-col">
                                {event.thumbnail ? (
                                    <img
                                        src={event.thumbnail}
                                        alt={event.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400">
                                        No Thumbnail
                                    </div>
                                )}
                                <div className="p-2 text-white">{event.name}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No event data could be fetched</p>
                )}
            </div> */}
        </div>
    );
};

export default Dashboard;
