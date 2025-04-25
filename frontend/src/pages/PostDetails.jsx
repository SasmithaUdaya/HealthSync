import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, likePost, getCommentsForPost } from '../api/api';
import CommentForm from '../components/CommentForm';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await getPostById(id);
            setPost(response.data);
        };
        fetchPost();

        // Fetch comments for the post
        const fetchComments = async () => {
            const response = await getCommentsForPost(id);
            console.log(response.data)
            setComments(response.data);
        };
        fetchComments();
    }, [id]);

    const handleLike = async () => {
        try {
            await likePost({
                postId: id,
                liked: true,
                userId: localStorage.getItem("username"), 
            });
            alert('Liked the post!');
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislike = async () => {
        try {
            await likePost({
                postId: id,
                liked: false,
                userId: localStorage.getItem("username"), 
            });
            alert('Disliked the post!');
        } catch (error) {
            console.error('Error disliking post:', error);
        }
    };

    return (
        <div className="bg-black text-white p-6 rounded-lg shadow-md">
            {post && (
                <div>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-400 mb-6">{post.description}</p>
                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={handleLike}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                        >
                            <span>Like</span>
                        </button>
                        <button
                            onClick={handleDislike}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                        >
                            <span>Dislike</span>
                        </button>
                    </div>

                    {/* Comment Form */}
                    <CommentForm postId={id} />

                    {/* Display Comments */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-2"
                                >
                                    <p>{comment.text}</p>
                                    <small className="text-gray-500">By: {comment.userId}</small>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;