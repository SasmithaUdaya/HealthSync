import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import DisplayPost from "../component/DisplayPost.jsx";
import {useAuth} from "../contexts/auth-context..jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SelectInterestsPage from "../pages/SelectInterestsPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import Notifications from "../component/Notifications.jsx";
import Ai_feech from "../component/Ai_feech.jsx";  // Make sure to import Ai_feech






const AppRouting = () => {
    // Set localStorage values once when component mounts
   /* useEffect(() => {
        localStorage.setItem('username', 'ranthilini');
        localStorage.setItem('userId', 1);
    }, []);*/

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
                <Route path="/post/:id" element={<DisplayPost />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/select-interests/:userId" element={<SelectInterestsPage />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-feech" element={<Ai_feech />} />
            </Routes>
        //</BrowserRouter>
    );
};

export default AppRouting;

