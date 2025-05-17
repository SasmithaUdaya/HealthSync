import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import Notifications from "../pages/Notifications.jsx";
import DisplayPost from "../component/DisplayPost.jsx";
import {useAuth} from "../contexts/auth-context..jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SelectInterestsPage from "../pages/SelectInterestsPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";





const AppRouting = () => {


    function PrivateRoute() {
        const { currentUser} = useAuth();
        return currentUser ? <Outlet /> : <Navigate to="/" replace />;
    }

    return (
        // <BrowserRouter>
            <Routes>
                {/*<Route path="/" element={<HomePage />} />*/}
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/addpost/:id" element={<AddPost />} />
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/post/:id" element={<DisplayPost />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/select-interests/:userId" element={<SelectInterestsPage />} />

            </Routes>
        //</BrowserRouter>
    );
};

export default AppRouting;

