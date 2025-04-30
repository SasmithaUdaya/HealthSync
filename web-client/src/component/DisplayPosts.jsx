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
    };

    const deletePost = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");
        if (confirmation) {
            try {
                await axios.delete(`http://localhost:8081/post/delete/${id}`);
                loadPosts();
                alert("Post deleted successfully!");
            } catch (error) {
                console.error("Error deleting post", error);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchParam(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header remains the same */}
            <header className="sticky top-0 z-20 bg-white shadow-sm p-4 border-b">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">HealthSync</h1>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        onChange={handleSearchChange}
                        className="w-48 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </header>

            {/* Posts */}
            <main className="max-w-4xl mx-auto p-6">
                {filteredData.map(post => (
                    <article
                        key={post.postId}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 mb-6"
                    >
                        {/* Clickable area for post view */}
                        <Link to={`/post/${post.postId}`} className="block">
                            {/* Header */}
                            <div className="flex items-center px-5 py-4 border-b">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                                    U
                                </div>
                                <span className="ml-3 text-sm text-gray-700 font-medium">
                                    user_{post.postId.slice(0, 4)}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="aspect-video bg-gray-100">
                                {post.postImage && (
                                    <img
                                        src={`http://localhost:8081/uploads/${post.postImage}`}
                                        alt="Post"
                                        className="w-full h-full object-cover hover:opacity-90 transition duration-200"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800">{post.postCategory}</h2>
                                <p className="text-gray-700 text-sm line-clamp-3">
                                    {post.description}
                                </p>
                                <p className="text-xs text-gray-500">{post.duration}</p>
                            </div>
                        </Link>

                        {/* Footer with buttons */}
                        <div className="flex justify-end items-center gap-4 px-5 py-4 border-t">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateNavigate(post.postId);
                                }}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePost(post.postId);
                                }}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}

                {/* No Results */}
                {filteredData.length === 0 && (
                    <div className="text-center py-20 text-gray-400 text-lg">
                        No posts match your search.
                    </div>
                )}
            </main>
        </div>
    );
}

export default DisplayPosts;
