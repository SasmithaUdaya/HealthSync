import React, { useState } from 'react';
import { addComment } from '../api/api';

const CommentForm = ({ postId }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addComment({ postId, text: commentText, userId: localStorage.getItem("username") });
            alert('Comment added successfully!');
            setCommentText('');
            window.location.reload()
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2 mt-4"
        >
            <input
                type="text"
                placeholder="Add a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit(e);
                    }
                }}
                className="flex-grow p-2 border text-black border-gray-300 rounded"
            />
            <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
                Comment
            </button>
        </form>
    );
};

export default CommentForm;