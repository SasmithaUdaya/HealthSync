import React, { useState } from 'react';
import { createPost } from '../api/api';

const PostForm = () => {
    const [post, setPost] = useState({
        title: '',
        description: '',
        status: '',
        duration: '',
        imageUrl: '',
    });

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPost(post);
            alert('Post created successfully!');
            setPost({
                title: '',
                description: '',
                status: '',
                duration: '',
                imageUrl: '',
            });
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
        >
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={post.title}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={post.description}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
                type="text"
                name="status"
                placeholder="Status"
                value={post.status}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={post.duration}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={post.imageUrl}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
            >
                Create Post
            </button>
        </form>
    );
};

export default PostForm;