import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DisplayPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/post/getpost/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post details", error);
                navigate("/allposts");
            }
        };
        loadPost();
    }, [id, navigate]);

    if (!post) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Back to Posts
                    </button>

                    <div className="space-y-6">
                        {post.postImage && (
                            <img
                                src={`http://localhost:8081/uploads/${post.postImage}`}
                                alt="Post"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        )}

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">{post.postCategory}</h1>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                                post.status === 'video' ? 'bg-blue-100 text-blue-800' :
                                    post.status === 'photo' ? 'bg-purple-100 text-purple-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                                {post.status}
                            </span>
                        </div>

                        <div className="prose max-w-none">
                            <p className="text-gray-600">{post.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-gray-500 text-sm">
                            <span>Duration: {post.duration}</span>
                            <span>Post ID: {post.postId}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayPost;