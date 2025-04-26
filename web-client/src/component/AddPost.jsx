import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPost = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        postCategory: '',
        description: '',
        status: '',
        duration: '',
        postImage: null
    });
    const [preview, setPreview] = useState('');

    const categories = [
        "Nutrition and diet planning",
        "Sleep and recovery",
        "Health and natural remedees",
        "Fitness and training program",
        "Brain and mental wellness"
    ];

    const onInputChange = (e) => {
        if(e.target.name === "postImage") {
            const file = e.target.files[0];
            setPost({ ...post, postImage: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPost({ ...post, [e.target.name]: e.target.value });
        }
    }

    const onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", post.postImage);

        let imageName = "";

        try {
            const res = await axios.post("http://localhost:8081/post/postimage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            imageName = res.data;
        } catch (error) {
            alert("Error uploading image");
            return;
        }

        const updatePost = {
            ...post,
            postImage: imageName};

        try {
            await axios.post("http://localhost:8081/post/create", updatePost);
            alert("Post added Successfully!");
            window.location.reload();
        } catch (err) {
            alert("Error adding post");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Post</h1>
                    <form onSubmit={onsubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="postCategory" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="postCategory"
                                    name="postCategory"
                                    value={post.postCategory}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={post.description}
                                    onChange={onInputChange}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        value={post.status}
                                        onChange={onInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        value={post.duration}
                                        onChange={onInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Post Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    {preview ? (
                                        <div className="text-center">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover mb-4 rounded-lg"
                                            />
                                            <p className="text-sm text-gray-600">
                                                {post.postImage.name}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="postImage"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="postImage"
                                                        name="postImage"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={onInputChange}
                                                        className="sr-only"
                                                        required
                                                        key={preview}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPost;