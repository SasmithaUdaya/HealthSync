import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api.js";



const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             //const token = response.data.data; // Extract token from ApiResponse
             const response = await api.post("/api/users/register", formData);
             const userId = response.data.result.user?.id;


             navigate(`/select-interests/${userId}`);
        } catch (error) {
            alert("Registration failed");
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Register Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="firstName"
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        name="lastName"
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <span
                        className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
            Sign In
          </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
