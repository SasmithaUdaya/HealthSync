import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/api';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            const response = await fetchPosts();
            setPosts(response.data);
        };
        fetchAllPosts();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="flex space-x-4 mb-8">
                <button className="bg-gray-200 px-4 py-2 rounded">
                    Nutrition & Diet Planning
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded">
                    Sleep & Recovery
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded">
                    Mental Wellness
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Post Section</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Home;