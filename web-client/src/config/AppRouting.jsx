import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';

import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import DisplayPost from "../component/DisplayPost.jsx";

import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';

import './App.css';

const AppRouting = () => {
    // Set localStorage values once when component mounts
    useEffect(() => {
        localStorage.setItem('username', 'ranthilini');
        localStorage.setItem('userId', 1);
    }, []);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                <Route path="/post/:id" element={<PostDetails />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouting;
