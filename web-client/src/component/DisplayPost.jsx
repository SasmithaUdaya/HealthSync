import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from "../api/api.js";

const DisplayPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/post/getpost/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!post) return <div className="text-center py-20">Post not found</div>;

    const commentCount = post.comments?.length || 0;
    const likeCount = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/home" className="text-indigo-600 hover:underline">
                            &larr; Back to Posts
                        </Link>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-800">{post.postCategory}</h1>

                        {post.postImage && (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={`http://localhost:8081/uploads/${post.postImage}`}
                                    alt="Post content"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-gray-600">
                                <div>
                                    <p className="font-medium">Focus Area:</p>
                                    <p>{post.focus}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Duration:</p>
                                    <p>{post.duration}</p>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium text-lg mb-2">Description</p>
                                <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
                            </div>

                            {post.reference && (
                                <div>
                                    <p className="font-medium text-lg mb-2">Reference Video</p>
                                    <a
                                        href={post.reference}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        Watch Video ↗
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer with Comments and Likes */}
                    <div className="flex items-center gap-4 px-5 py-3 border-t mt-6">
                        {/* Comments count */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{commentCount} comments</span>
                        </div>

                        {/* Likes count */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3.172 5.172a4.001 4.001 0 015.656 0L10 6.343l1.172-1.171a4.001 4.001 0 115.656 5.656L10 18.657l-6.828-6.829a4.001 4.001 0 010-5.656z" />
                            </svg>
                            <span>{likeCount} likes</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayPost;
