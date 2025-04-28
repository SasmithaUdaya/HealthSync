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

                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((post) => (
                                <div key={post.postId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <Link to={`/post/${post.postId}`} className="block">
                                        {post.postImage && (
                                            <img
                                                src={`http://localhost:8081/uploads/${post.postImage}`}
                                                alt="Post"
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.postCategory}</h3>
                                            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Focus:</span> {post.focus}</p>
                                            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Duration:</span> {post.duration}</p>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
                                            {post.reference && (
                                                <a
                                                    href={post.reference}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:underline text-sm"
                                                >
                                                    Watch Video
                                                </a>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="px-6 py-4 border-t flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex space-x-4">
                                            <button className="flex items-center text-gray-500 hover:text-indigo-600">
                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                                Like
                                            </button>
                                            <button className="flex items-center text-gray-500 hover:text-indigo-600">
                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Comment
                                            </button>
                                            <button className="flex items-center text-gray-500 hover:text-indigo-600">
                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                                Share
                                            </button>
                                        </div>
                                        <div className="flex space-x-4">
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
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No posts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisplayPosts;
