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
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", form);
            toast.success(response.data.msg || "Registered successfully!");
            setForm({ name: "", email: "", password: "", roleIntent: "user" });
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-neutral-900 border border-white/10 shadow-xl rounded-2xl p-8 w-full max-w-xl flex flex-col gap-6"
            >
                <h1 className="text-3xl font-semibold text-center mb-3">Create Account</h1>

                {[
                    { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                    { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
                    { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
                    { label: "Role", name: "roleIntent", type: "text", placeholder: "user", disabled: true },
                ].map((field) => (
                    <div key={field.name} className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                        <label className="sm:w-32 text-gray-400 text-xl">{field.label}</label>
                        <input
                            name={field.name}
                            type={field.type}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            disabled={field.disabled || false}
                            required={!field.disabled}
                            className={`text-xl flex-1 p-3 text-white rounded-md bg-black border border-gray-700 focus:border-purple-500 outline-none transition ${field.disabled ? "text-gray-400 cursor-not-allowed" : ""
                                }`}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-md font-semibold transition cursor-pointer mt-3 ${loading
                        ? "bg-purple-900 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                        }`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-gray-400 text-lg text-center mt-3">
                    Already have an account?{" "}
                    <a href="/login" className="text-xl text-purple-400 hover:text-purple-300">
                        Login
                    </a>
                </p>
            </form>
        </div>


    );
};

export default RegisterUser;
