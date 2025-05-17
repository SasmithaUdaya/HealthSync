import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import 'react-loading-skeleton/dist/skeleton.css';

const UpdateLearningPlan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        status: 'DRAFT',
        learningImg: null,
        progress: 0,
        tasks: [],
    });

    const [newTask, setNewTask] = useState(''); // For task input
    const [oldImage, setOldImage] = useState('');
    const [newImagePreview, setNewImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/learning-plans/getAll/${id}`);
                setFormData({
                    id: response.data.id,
                    title: response.data.title,
                    description: response.data.description,
                    status: response.data.status,
                    progress: response.data.progress || 0,
                    tasks: response.data.tasks || [],
                });
                setOldImage(response.data.learningImg || '');
            } catch (error) {
                console.error("Error fetching learning plan details", error);
                alert("Error loading learning plan data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'progress' ? Math.max(0, Math.min(100, parseFloat(value) || 0)) : value
        }));
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, learningImg: file }));
            const reader = new FileReader();
            reader.onloadend = () => setNewImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleTaskInputChange = (e) => {
        setNewTask(e.target.value);
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        setFormData(prev => ({
            ...prev,
            tasks: [...prev.tasks, { name: newTask.trim(), completed: false }]
        }));
        setNewTask('');
    };

    const removeTask = (index) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        const learningPlanDetails = {
            id: formData.id,
            title: formData.title,
            description: formData.description,
            status: formData.status,
            progress: formData.progress,
            tasks: formData.tasks, // Include tasks
        };
        data.append("learningPlanDetails", JSON.stringify(learningPlanDetails));

        if (formData.learningImg) {
            data.append("file", formData.learningImg);
        }

        try {
            await api.put(`/learning-plans/update/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Learning Plan Updated Successfully");
            navigate("/learningplans");
        } catch (error) {
            console.error("Error updating post", error.response ? error.response.data : error);
            alert(error.response?.data?.message || "Error updating Learning plan");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-900">Loading learning plan data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="p-6 bg-indigo-700 text-white">
                        <h1 className="text-2xl font-bold">Update Learning Plan</h1>
                        <p className="mt-1">Edit your learning plan below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={onInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Enter the title"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Describe your learning objectives, goals, etc."
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={onInputChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tasks
                                </label>
                                <div className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={handleTaskInputChange}
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                        placeholder="Enter a task"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTask}
                                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                                {formData.tasks.length > 0 && (
                                    <ul className="space-y-2">
                                        {formData.tasks.map((task, index) => (
                                            <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                                    {task.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTask(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                                    alt="Current Learning Plan"
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
                                                            setFormData(prev => ({ ...prev, learningImg: null }));
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
                                onClick={() => navigate("/learningplans")}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Updating...' : 'Update Learning Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateLearningPlan;