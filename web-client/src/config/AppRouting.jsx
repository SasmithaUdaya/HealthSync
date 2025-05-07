import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import Notifications from "../pages/Notifications.jsx";
import PostDetails from "../pages/PostDetails.jsx";
import DisplayPost from "../component/DisplayPost.jsx";


const AppRouting = () => {
    // Set localStorage values once when component mounts
    useEffect(() => {
        localStorage.setItem('username', 'ranthilini');
        localStorage.setItem('userId', 1);
    }, []);

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                {/*<Route path="/post/:id" element={<PostDetails />} />*/}
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/post/:id" element={<DisplayPost />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouting;

