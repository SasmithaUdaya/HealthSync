import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function DisplayPosts() {
    const [posts, setPosts] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState("");

    const filteredData = useMemo(() => {
        if (!searchParam) return posts;
        return posts.filter(post =>
            post.postCategory.toLowerCase().includes(searchParam.toLowerCase()) ||
            post.description.toLowerCase().includes(searchParam.toLowerCase())
        );
    }, [posts, searchParam]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const result = await axios.get("http://localhost:8081/post/getposts");
            setPosts(result.data);
        } catch (error) {
            console.error("Error fetching posts", error);
        }
    };

    const updateNavigate = (id) => {
        navigate(`/updatepost/${id}`);
    }

    const deletePost = async (id) => {
        const confirmationMessage = window.confirm("Are you sure you want to delete this post?");
        if(confirmationMessage) {
            try {
                await axios.delete(`http://localhost:8081/post/delete/${id}`);
                loadPosts();
                alert("Post deleted successfully");
            } catch (error) {
                console.error("Error deleting post", error);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchParam(e.target.value);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            onChange={handleSearchChange}
                            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((post) => (
                            <div key={post.postId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <Link to={`/post/${post.postId}`} className="block">
                                    <div className="p-6">
                                        {post.postImage && (
                                            <img
                                                src={`http://localhost:8081/uploads/${post.postImage}`}
                                                alt="Post"
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        )}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{post.postCategory}</h3>
                                                <span className={`px-2 py-1 text-sm rounded-full ${
                                                    post.status === 'video' ? 'bg-green-100 text-green-800' :
                                                        post.status === 'photo' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {post.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="p-4 border-t">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Duration: {post.duration}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => updateNavigate(post.postId)}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.postId)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No posts found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisplayPosts;