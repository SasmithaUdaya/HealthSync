import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import DisplayPosts from "../component/DisplayPosts.jsx";
import LearningPlanPage from '../pages/LearningPlanPage';
import CreateLearningPlanPage from '../pages/CreateLearningPlanPage';
import EditLearningPlanPage from '../pages/EditLearningPlanPage';

export const AppRouting = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={ <HomePage/>} />
                <Route path="/addpost" element={<AddPost />} />
                <Route path="/allposts" element={<DisplayPosts />} />
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                <Route path="/learningplans" element={<LearningPlanPage />} />
                <Route path="/create-learning-plan" element={<CreateLearningPlanPage />} />
                <Route path="/edit-learning-plan/:id" element={<EditLearningPlanPage />} />
            </Routes>
        </BrowserRouter>
    );
};
