import React, { useEffect, useState, useRef } from 'react';
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiClock, FiCheckCircle, FiArchive, FiX } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';
import {useAuth} from "../contexts/auth-context..jsx";
 // Fixed import typo

const ViewLearningPlan = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [taskLoading, setTaskLoading] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const { currentUser } = useAuth();
    const modalRef = useRef(null);
    const deleteModalRef = useRef(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await api.get("/learning-plans/allLP");

                // Filter plans where authorId matches currentUser.id
                const userPlans = response.data.filter(plan => plan.authorId === currentUser.id);

                setPlans(userPlans);
            } catch (error) {
                console.error('Error fetching plans:', error);
                showNotification('error', 'Failed to load learning plans. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.id) {
            fetchPlans();
        }
    }, [currentUser]); // Add currentUser to dependency array

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setSelectedPlan(null);
            }
            if (deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
                setShowDeleteModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showNotification = (type, message) => {
        if (type === 'error') {
            setErrorMessage(message);
            setTimeout(() => setErrorMessage(''), 5000);
        } else {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const updateNavigate = (id) => navigate(`update/${id}`);

    const confirmDelete = (planId) => {
        setPlanToDelete(planId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(planToDelete);
            await api.delete(`/learning-plans/delete/${planToDelete}`);
            setPlans(plans.filter(plan => plan.id !== planToDelete));
            setShowDeleteModal(false);
            showNotification('success', 'Learning plan deleted successfully');
        } catch (error) {
            console.error('Error deleting plan:', error);
            showNotification('error', 'Failed to delete learning plan');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleToggleTask = async (planId, taskIndex) => {
        try {
            setTaskLoading(`${planId}-${taskIndex}`);
            const response = await api.patch(`/learning-plans/toggle-task/${planId}/${taskIndex}`);
            setPlans(plans.map(plan => plan.id === planId ? response.data : plan));
            if (selectedPlan && selectedPlan.id === planId) {
                setSelectedPlan(response.data);
            }
        } catch (error) {
            console.error('Error toggling task:', error);
            showNotification('error', 'Failed to update task status');
        } finally {
            setTaskLoading(null);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DRAFT': return <FiClock className="text-yellow-500" />;
            case 'ACTIVE': return <FiCheckCircle className="text-green-500" />;
            case 'COMPLETED': return <FiCheckCircle className="text-blue-500" />;
            case 'ARCHIVED': return <FiArchive className="text-gray-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800';
            case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const Notification = ({ type, message, onClose }) => {
        const bgColor = type === 'error' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500';
        const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
        const iconColor = type === 'error' ? 'text-red-500' : 'text-green-500';

        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-4 right-4 z-50 p-4 border-l-4 rounded-md shadow-lg ${bgColor} max-w-md w-full`}
            >
                <div className="flex items-start">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                        {type === 'error' ? (
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3">
                        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto pl-3 -mr-1"
                    >
                        <FiX className={`h-5 w-5 ${textColor}`} />
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence>
                {errorMessage && (
                    <Notification
                        type="error"
                        message={errorMessage}
                        onClose={() => setErrorMessage('')}
                    />
                )}
                {successMessage && (
                    <Notification
                        type="success"
                        message={successMessage}
                        onClose={() => setSuccessMessage('')}
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Learning Plans</h1>
                    <p className="mt-2 text-gray-600">Track and manage your learning journey</p>
                </div>
                <button
                    onClick={() => navigate(`/learning-plan/${currentUser.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Create New Plan
                </button>
            </div>

            {loading && (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border rounded-lg overflow-hidden shadow-sm bg-white"
                        >
                            <Skeleton height={180} />
                            <div className="p-4">
                                <Skeleton count={2} />
                                <Skeleton width={100} className="mt-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && plans.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No learning plans</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new learning plan.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate(`/learning-plan/${currentUser.id}`)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                            New Learning Plan
                        </button>
                    </div>
                </motion.div>
            )}

            {!loading && plans.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                >
                    {plans.map(plan => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -5 }}
                            className="border rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => setSelectedPlan(plan)}
                        >
                            {plan.learningImg ? (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={`http://localhost:8081/uploads/${plan.learningImg}`}
                                        alt={plan.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center">
                                    <svg className="h-16 w-16 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-600">Created by: </span>
                                        <span className="ml-1 text-sm font-semibold text-gray-900">{plan.authorUsername}</span>
                                    </div>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                                        {getStatusIcon(plan.status)}
                                        <span className="ml-1">{plan.status}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-2">{plan.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{plan.description || 'No description provided'}</p>

                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Progress</label>
                                        <span className="text-sm text-gray-500">{plan.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${plan.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {plan.authorId === currentUser.id && (
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateNavigate(plan.id); }}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                                        >
                                            <FiEdit className="mr-1.5 h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); confirmDelete(plan.id); }}
                                            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-900"
                                        >
                                            <FiTrash2 className="mr-1.5 h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <AnimatePresence>
                {selectedPlan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.title}</h2>
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-600">Created by: </span>
                                    <span className="ml-1 text-sm font-semibold text-gray-900">{selectedPlan.authorUsername}</span>
                                </div>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPlan.status)}`}>
                                    {getStatusIcon(selectedPlan.status)}
                                    <span className="ml-1">{selectedPlan.status}</span>
                                </div>
                            </div>

                            {selectedPlan.learningImg && (
                                <div className="mb-6">
                                    <img
                                        src={`http://localhost:8081/uploads/${selectedPlan.learningImg}`}
                                        alt={selectedPlan.title}
                                        className="w-full h-64 object-cover rounded-lg shadow-sm"
                                    />
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">
                                    {selectedPlan.description || 'No description provided'}
                                </p>
                            </div>

                            {selectedPlan.tasks && selectedPlan.tasks.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tasks</h3>
                                    <ul className="space-y-3">
                                        {selectedPlan.tasks.map((task, index) => (
                                            <motion.li
                                                key={index}
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() => handleToggleTask(selectedPlan.id, index)}
                                                        disabled={taskLoading === `${selectedPlan.id}-${index}`}
                                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    />
                                                    <span className={`ml-3 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                        {task.name}
                                                    </span>
                                                </div>
                                                {taskLoading === `${selectedPlan.id}-${index}` && (
                                                    <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-500">{selectedPlan.progress}% completed</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${selectedPlan.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {selectedPlan.authorId === currentUser.id && (
                                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => updateNavigate(selectedPlan.id)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                    >
                                        <FiEdit className="mr-2 h-4 w-4" />
                                        Edit Plan
                                    </button>
                                    <button
                                        onClick={() => { setSelectedPlan(null); confirmDelete(selectedPlan.id); }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                    >
                                        <FiTrash2 className="mr-2 h-4 w-4" />
                                        Delete Plan
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            ref={deleteModalRef}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FiX className="h-6 w-6" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this learning plan? This action cannot be undone.
                            </p>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-70"
                                >
                                    {deleteLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ViewLearningPlan;