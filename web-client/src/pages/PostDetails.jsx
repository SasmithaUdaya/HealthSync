import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, likePost, getCommentsForPost, deleteComment, updateComment } from '../api/api';
import CommentForm from '../components/CommentForm';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            const response = await getPostById(id);
            setPost(response.data);
        };
        fetchPost();

        // Fetch comments for the post
        const fetchComments = async () => {
            const response = await getCommentsForPost(id);
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

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            // Refresh comments after deletion
            const response = await getCommentsForPost(id);
            setComments(response.data);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment.');
        }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await updateComment(commentId, editedText);
            setEditingCommentId(null);
            // Refresh comments
            const response = await getCommentsForPost(id);
            setComments(response.data);
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment.');
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
                                    className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-2 relative"
                                >
                                    {editingCommentId === comment.id ? (
                                        <div className="mb-2">
                                            <textarea
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                className="w-full p-2 text-black rounded"
                                            />
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateComment(comment.id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingCommentId(null)}
                                                    className="bg-gray-500 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p>{comment.text}</p>
                                            <small className="text-gray-500">By: {comment.userId}</small>
                                        </>
                                    )}
                                    
                                    {comment.userId === localStorage.getItem("username") && (
                                        <div className="absolute top-2 right-2 space-x-2">
                                            <button 
                                                onClick={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditedText(comment.text);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
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