import React, { useState, useRef } from 'react';
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle, FiPlus, FiTrash2 } from 'react-icons/fi';
import {useAuth} from "../contexts/auth-context..jsx";


const LearningPlanForm = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'DRAFT',
        learningImg: null,
        progress: 0,
        tasks: [], // Added tasks field
    });

    const [newTask, setNewTask] = useState(''); // For task input
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [preview, setPreview] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'progress' ? Math.max(0, Math.min(100, parseFloat(value) || 0)) : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 10 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            setErrorMessage('Please upload a valid image file (JPEG, PNG, GIF)');
            return;
        }

        if (file.size > maxSize) {
            setErrorMessage('Image size must be less than 10MB');
            return;
        }

        setFormData(prev => ({ ...prev, learningImg: file }));
        setErrorMessage('');

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, learningImg: null }));
        setPreview("");
        if (fileInputRef.current) fileInputRef.current.value = '';
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

        if (!currentUser || !currentUser.id) {
            setErrorMessage('Please log in to create a Learning Plan');
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        if (!formData.title.trim()) {
            setErrorMessage('Title is required');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let imageName = "";

            if (formData.learningImg) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", formData.learningImg);

                const config = {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) =>
                        setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total)),
                };

                const res = await api.post("/learning-plans/learningimg", uploadFormData, config);
                imageName = res.data;
            }

            const learningPlanData = {
                authorId: currentUser.id,
                title: formData.title,
                description: formData.description,
                status: formData.status,
                learningImg: imageName || "",
                progress: formData.progress,
                tasks: formData.tasks, // Include tasks
            };

            await api.post(`/learning-plans/createLP/${currentUser.id}`, learningPlanData);

            setSuccessMessage('Learning plan created successfully!');
            setFormData({
                title: '',
                description: '',
                status: 'DRAFT',
                learningImg: null,
                progress: 0,
                tasks: [],
            });
            setPreview("");
            setUploadProgress(0);
            setNewTask('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(
                error.response?.data?.error || error.message || 'Failed to create learning plan. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold">Create New Learning Plan</h1>
                    <p className="mt-1 opacity-90">Design your personalized learning journey</p>
                </div>

                <div className="px-6 pt-4">
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                            <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-green-800 font-medium">Success!</h3>
                                <p className="text-green-700 text-sm">{successMessage}</p>
                            </div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <FiAlertCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="text-red-800 font-medium">Error</h3>
                                <p className="text-red-700 text-sm">{errorMessage}</p>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                            placeholder="Enter learning plan title"
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    {/* Tasks Field */}
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
                                        <span>{task.name}</span>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Image
                        </label>
                        {preview ? (
                            <div className="relative group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition duration-200 opacity-0 group-hover:opacity-100"
                                    aria-label="Remove image"
                                >
                                    <FiX className="text-gray-700" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-400 transition duration-200">
                                <div className="space-y-3 text-center">
                                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center">
                                        <label
                                            htmlFor="learningImg"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                        >
                                            <span>Upload an image</span>
                                            <input
                                                id="learningImg"
                                                name="learningImg"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="sr-only"
                                                ref={fileInputRef}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                        )}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">
                                    Uploading: {uploadProgress}%
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ${
                                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : 'Create Learning Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LearningPlanForm;