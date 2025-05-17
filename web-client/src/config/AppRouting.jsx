import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import DisplayPost from "../component/DisplayPost.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SelectInterestsPage from "../pages/SelectInterestsPage";
import ProfilePage from "../pages/ProfilePage";
import FollowingPage from "../pages/FollowingPage";
import FollowersPage from "../pages/FollowersPage";

export const AppRouting = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                <Route path="/post/:id" element={<DisplayPost />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/select-interests/:userId" element={<SelectInterestsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/following" element={<FollowingPage />} />
                <Route path="/followers" element={<FollowersPage />} />
            </Routes>
        </BrowserRouter>
    );
};
