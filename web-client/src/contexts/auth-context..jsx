import  { createContext, useContext, useState,  useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../api/auth_service.js";


const AuthContext = createContext(undefined);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        if (token && user) {
            setAccessToken(token);
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    // Redirect to appropriate dashboard based on user role
    useEffect(() => {
        if (currentUser && !loading) {
            const path = window.location.pathname;
            // Only redirect if at root, login, or register
            if (path === '/' || path === '/login' || path === '/register') {
                navigate("/");
            }
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    const loginUser = async (email, password) => {
        const res = await login(email, password);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
        setAccessToken(res.accessToken);
        setCurrentUser(res.user);

       navigate('/home') //frontend redirect
    };

    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setCurrentUser(null);
        navigate("/login"); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ loading, currentUser, accessToken, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};