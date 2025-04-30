import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DisplayPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/post/getpost/${id}`);
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
                        <Link to="/" className="text-indigo-600 hover:underline">
                            &larr; Back to Posts
                        </Link>
                        <div className="text-sm text-gray-500">
                            💬 {commentCount} Comments • ❤️ {likeCount} Likes
                        </div>
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
                </div>
            </div>
        </div>
    );
};

export default DisplayPost;
