import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      const username = response.data.data.name;
      setUser(username.split(" ")[0]);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true }); // ensure cookies cleared on backend

      // Remove local session
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"]; // <-- key step

      // Reset user state
      setUser(null);

      // Force revalidation
      await fetchUser();

      toast.success("Logged out successfully");
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full py-6 px-8 flex justify-between items-center border-b border-white/10 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <h1
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"
          onClick={() => navigate("/")}
        >
          EventVerse
        </h1>

        {user ? (
          <div className="flex items-center gap-5">
            <p className="text-gray-300 text-lg">
              Welcome,{" "}
              <span className="text-white font-medium">{user}</span>
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer text-lg px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer text-lg px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Bigger, closer organizer/owner links */}
            <div className="flex items-center gap-5 text-lg">
              <a
                href="/organizerLogin"
                className="text-lg text-gray-300 hover:text-purple-400 transition-all duration-200 font-medium relative group"
              >
                Login as Organizer
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a
                href="/ownerLogin"
                className="text-lg text-gray-300 hover:text-pink-400 transition-all duration-200 font-medium relative group"
              >
                Login as Venue Owner
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Main auth buttons */}
            <div className="flex items-center gap-3 ml-3">
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer text-lg px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="cursor-pointer text-lg px-4 py-2 border border-purple-600 hover:bg-purple-600 hover:text-white transition rounded-lg font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <h2 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
          Manage Events Effortlessly.
          <br />
          <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            Plan, Connect, Celebrate.
          </span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mb-10">
          Streamline your event experience — from booking venues to connecting
          with top organizers. Built for creators, innovators, and dreamers.
        </p>

        <button
          onClick={() => navigate(user ? "/dashboard" : "/register")}
          className="cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-200"
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} EventVerse — Built with ❤️ for creators
      </footer>
    </div>
  );
};

export default Home;
