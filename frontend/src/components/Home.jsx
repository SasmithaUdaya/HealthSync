import React from 'react';


const Home = () => {
    return (
        <div>
            <button className="flex justify-center items-center min-h-screen bg-yellow-400"   onClick={()=>(window.location.href='/addpost')}>Add Post</button>
            <button className="flex justify-center items-center min-h-screen bg-yellow-400"   onClick={()=>(window.location.href='/allposts')}>All Posts</button>
        </div>
    );
};

export default Home;