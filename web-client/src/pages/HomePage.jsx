import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState("");
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

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
            } catch (error) {
                console.error("Error deleting post", error);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchParam(e.target.value);
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8081/posts/${postId}/comments`, {
                text: newComment,
                author: "Current User"
            });
            setNewComment("");
            loadPosts();
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const handleUpdateComment = async (postId, commentId) => {
        try {
            await axios.put(`http://localhost:8081/posts/${postId}/comments/${commentId}`, {
                text: editingCommentText,
            });
            setEditingCommentId(null);
            setEditingCommentText("");
            loadPosts();
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        const confirmation = window.confirm("Are you sure you want to delete this comment?");
        if (confirmation) {
            try {
                await axios.delete(`http://localhost:8081/posts/${postId}/comments/${commentId}`);
                loadPosts();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const handlePostClick = (e, postId) => {
        // Don't navigate if clicking on buttons or comment section
        if (e.target.closest('button') || e.target.closest('.comment-section')) {
            return;
        }
        navigate(`/post/${postId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 mr-64">
                <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">HealthSync Platform</h1>
                    <div className="w-full max-w-lg">
                        <button
                            onClick={() => navigate('/addpost')}
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Post
                        </button>
                    </div>
                </div>

                <div className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
                    <div className="max-w-lg mx-auto flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-gray-800">Latest Posts</h1>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            onChange={handleSearchChange}
                            className="w-48 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>

                <div className="max-w-lg mx-auto py-6 px-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((post) => (
                            <div
                                key={post.postId}
                                onClick={(e) => handlePostClick(e, post.postId)}
                                className="bg-white mb-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex items-center p-4 border-b">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-600 text-sm font-medium">{post.postId?.charAt(0) || 'U'}</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">{post.postId || "Unknown User"}</p>
                                        <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="aspect-video bg-gray-50">
                                    {post.postImage && (
                                        <img
                                            src={`http://localhost:8081/uploads/${post.postImage}`}
                                            alt="Post content"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-4 space-y-3">
                                    <h2 className="text-xl font-semibold text-gray-800">{post.postCategory}</h2>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>Duration: {post.duration}</span>
                                    </div>
                                </div>

                                <div className="p-4 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex gap-4 text-sm text-gray-600">
                                            <span>💬 {post.comments?.length || 0}</span>
                                            <span>❤️ {post.likes || 0}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setExpandedPostId(expandedPostId === post.postId ? null : post.postId);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                                            >
                                                Comments
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    updateNavigate(post.postId);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    deletePost(post.postId);
                                                }}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {expandedPostId === post.postId && (
                                        <div className="mt-4 pt-4 border-t comment-section">
                                            <div className="space-y-4 mb-4">
                                                {post.comments?.map(comment => (
                                                    <div key={comment.id} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                                                            U
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">{comment.author}</p>
                                                            {editingCommentId === comment.id ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={editingCommentText}
                                                                        onChange={(e) => setEditingCommentText(e.target.value)}
                                                                        className="w-full px-2 py-1 border rounded text-sm"
                                                                    />
                                                                    <div className="flex gap-2 mt-2">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleUpdateComment(post.postId, comment.id);
                                                                            }}
                                                                            className="text-sm bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setEditingCommentId(null);
                                                                                setEditingCommentText("");
                                                                            }}
                                                                            className="text-sm bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p className="text-gray-600 text-sm">{comment.text}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {new Date(comment.timestamp).toLocaleString()}
                                                                    </p>
                                                                    {comment.author === "Current User" && (
                                                                        <div className="flex gap-2 mt-2">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    setEditingCommentId(comment.id);
                                                                                    setEditingCommentText(comment.text);
                                                                                }}
                                                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    handleDeleteComment(post.postId, comment.id);
                                                                                }}
                                                                                className="text-sm text-red-600 hover:text-red-800"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <form
                                                className="flex gap-2"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCommentSubmit(e, post.postId);
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Add a professional comment..."
                                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                                >
                                                    Post
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No posts found matching your criteria
                        </div>
                    )}
                </div>
            </div>

            <div className="w-64 bg-white border-l fixed right-0 top-0 h-full shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-indigo-700">HealthSync</h2>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">29°C</span>
                            <span className="text-sm text-gray-500">Mostly cloudy</span>
                        </div>
                    </div>

                    <nav className="mb-8">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/learning-plans"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Learning Plans</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Profile</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="border-t pt-4">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};