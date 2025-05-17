import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/api.js";
import {useAuth} from "../contexts/auth-context..jsx";

function UpdatePost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        postId: '',
        postCategory: '',
        focus: '',
        description: '',
        duration: '',
        reference: '',
        postImage: null
    });

     const { currentUser } = useAuth();

    const [oldImage, setOldImage] = useState('');
    const [newImagePreview, setNewImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        "Nutrition and diet planning",
        "Sleep and recovery",
        "Health and natural remedies",
        "Fitness and training program",
        "Brain and mental wellness",
    ];


    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/post/getpost/${id}`);
                setFormData({
                    postId: response.data.postId,
                    postCategory: response.data.postCategory || '',
                    focus: response.data.focus || '',
                    description: response.data.description || '',
                    duration: response.data.duration || '',
                    reference: response.data.reference || ''
                });
                setOldImage(response.data.postImage || '');
            } catch (error) {
                console.error("Error fetching post details", error);
                alert("Error loading post data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost().then();
    }, [id]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, postImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append("postDetails", JSON.stringify({
            postId: formData.postId,
            postCategory: formData.postCategory,
            focus: formData.focus,
            description: formData.description,
            duration: formData.duration,
            reference: formData.reference
        }));

        if (formData.postImage) {
            data.append("file", formData.postImage);
        }

        try {
            await api.put(`/post/posts/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Post Updated Successfully");
            navigate("/home");
        } catch (error) {
            console.error("Error updating post", error);
            alert("Error updating post");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-900">Loading post data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 bg-indigo-700 text-white">
                        <h1 className="text-2xl font-bold">Update Post</h1>
                        <p className="mt-1">Edit your post details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="postCategory"
                                    value={formData.postCategory}
                                    onChange={onInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Focus Area
                                </label>
                                <input
                                    type="text"
                                    name="focus"
                                    value={formData.focus}
                                    onChange={onInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter focus area"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={onInputChange}
                                    placeholder="e.g., 30 days"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={onInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reference Link
                                </label>
                                <input
                                    type="url"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={onInputChange}
                                    placeholder="https://example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Image
                                        </label>
                                        {oldImage ? (
                                            <div className="mt-1">
                                                <img
                                                    src={`http://localhost:8081/uploads/${oldImage}`}
                                                    alt="Current Post"
                                                    className="w-full h-48 object-cover rounded-lg border"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                                                <span className="text-gray-500">No image uploaded</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Image (Optional)
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            {newImagePreview ? (
                                                <div className="text-center">
                                                    <img
                                                        src={newImagePreview}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover mb-4 rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setNewImagePreview('');
                                                            setFormData(prev => ({ ...prev, postImage: null }));
                                                        }}
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Remove Image
                                                    </button>
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
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload a file</span>
                                                            <input
                                                                type="file"
                                                                onChange={onFileChange}
                                                                className="sr-only"
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG up to 5MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate("/allposts")}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Updating...' : 'Update Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatePost;