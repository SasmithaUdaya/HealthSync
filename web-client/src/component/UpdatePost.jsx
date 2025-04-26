import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdatePost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formdata, setFormData] = useState({
        postId: '',
        postCategory: '',
        description: '',
        status: '',
        duration: '',
        postImage: null,
    });
    const [oldImage, setOldImage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8081/post/getpost/${id}`)
            .then(response => {
                setFormData({
                    postId: response.data.postId,
                    postCategory: response.data.postCategory,
                    description: response.data.description,
                    status: response.data.status,
                    duration: response.data.duration,
                });
                setOldImage(response.data.postImage);
            })
            .catch(error => {
                console.error("Error fetching post details", error);
            });
    }, [id]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFileChange = (e) => {
        setFormData(prev => ({ ...prev, postImage: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("postDetails", JSON.stringify({
            postId: formdata.postId,
            postCategory: formdata.postCategory,
            description: formdata.description,
            status: formdata.status,
            duration: formdata.duration,
        }));

        if (formdata.postImage) {
            data.append("file", formdata.postImage);
        }

        try {
            await axios.put(`http://localhost:8081/post/posts/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Post Updated Successfully");
            navigate("/allposts");
        } catch (error) {
            console.error("Error updating post", error);
            alert("Error updating post");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Update Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Post Category
                                </label>
                                <input
                                    type="text"
                                    name="postCategory"
                                    value={formdata.postCategory}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formdata.duration}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formdata.description}
                                    onChange={onInputChange}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formdata.status}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    placeholder="Enter status (e.g., video, photo)"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Image
                                        </label>
                                        {oldImage && (
                                            <img
                                                src={`http://localhost:8081/post/uploads/${oldImage}`}
                                                alt="Current Post"
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Image (Optional)
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input
                                                            type="file"
                                                            onChange={onFileChange}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                Update Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatePost;