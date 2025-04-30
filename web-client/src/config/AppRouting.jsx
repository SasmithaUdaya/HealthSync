import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage.jsx";
import AddPost from "../component/AddPost.jsx";
import UpdatePost from "../component/UpdatePost.jsx";
import DisplayPosts from "../component/DisplayPosts.jsx";
import DisplayPost from "../component/DisplayPost.jsx";


export const AppRouting = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={ <HomePage/>} />
                <Route path="/addpost" element={<AddPost />} />
                {/*<Route path="/allposts" element={<DisplayPosts />} />*/}
                <Route path="/updatepost/:id" element={<UpdatePost />} />
                <Route path="/post/:id" element={<DisplayPost />} />
            </Routes>
        </BrowserRouter>
    );
};
