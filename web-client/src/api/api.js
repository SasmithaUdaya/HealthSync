import axios from 'axios';

// Post APIs
export const fetchPosts = async () => {
    return await api.get(`/posts`);
};

export const createPost = async (post) => {
    return await api.post(`/posts`, post);
};

export const getPostById = async (postId) => {
    return await api.get(`/posts/${postId}`);
};

export const updatePost = async (postId, postData) => {
    return await api.put(`/posts/${postId}`, postData);
};

export const deletePost = async (postId) => {
    return await api.delete(`/posts/${postId}`);
};


// In your API service file (api.js), update the comment endpoints:
export const createComment = async (postId, commentData) => {
    return await api.post(`/comment/create/${postId}`, commentData);
};

export const updateComment = async (commentId, commentData) => {
    return await api.put(`/comment/update/${commentId}`, commentData);
};

export const deleteComment = async (commentId) => {
    return await api.delete(`/comment/delete/${commentId}`);
};

export const getCommentsForPost = async (postId) => {
    return await api.get(`/comment/getcomments/${postId}`);
};




// Like/Dislike APIs
export const likePost = async (postId) => {
    return await api.post(`/posts/${postId}/like`);
};

export const dislikePost = async (postId) => {
    return await api.post(`/posts/${postId}/dislike`);
};

export const getLikesCount = async (postId) => {
    return await api.get(`/posts/${postId}/likes`);
};

export const getDislikesCount = async (postId) => {
    return await api.get(`/posts/${postId}/dislikes`);
};

// Notification APIs
export const fetchNotifications = async () => {
    return await api.get(`/notifications`);
};

export const markNotificationAsRead = async (id) => {
    return await api.put(`/notifications/${id}/read`);
};

export const deleteNotification = async (id) => {
    return await api.delete(`/notifications/${id}`);
};

export const getNotificationsByPostId = async (postId) => {
    return await api.get(`/notifications/post/${postId}`);
};

export const getNotificationsByCommentId = async (commentId) => {
    return await api.get(`/notifications/comment/${commentId}`);
};

// User APIs
export const getUserProfile = async (userId) => {
    return await api.get(`/api/users/${userId}`);
};

export const updateUserProfile = async (userId, userData) => {
    return await api.put(`/api/users/${userId}`, userData);
};

// Auth APIs
export const loginUser = async (credentials) => {
    return await api.post(`/api/auth/login`, credentials);
};

export const registerUser = async (userData) => {
    return await api.post(`/api/auth/register`, userData);
};

export const logoutUser = async () => {
    return await api.post(`/api/auth/logout`);
};

//----------------------------------axios config-----------------
const api = axios.create({
    baseURL: 'http://localhost:8081',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
