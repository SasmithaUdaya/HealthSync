import {useNavigate} from "react-router-dom";

export const HomePage = () => {

    const navigate = useNavigate();
    return (
        <>
            <div>
                <button className="flex justify-center items-center  bg-yellow-400"   onClick={()=>(navigate('/addpost'))}>Add Post</button>
                <button className="flex justify-center items-center  bg-yellow-400"   onClick={()=>(navigate('/allposts'))}>All Posts</button>
            </div>
        </>
    )
}