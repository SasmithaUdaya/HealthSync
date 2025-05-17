import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {useAuth} from "../contexts/auth-context..jsx";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {loginUser} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        loginUser (email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Sign In to HealthSync
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Don’t have an account?{" "}
                    <span
                        className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
            Sign Up
          </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
