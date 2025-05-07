import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchPosts = async () => {
    return await axios.get(`${API_URL}/posts`);
};

export const createPost = async (post) => {
    return await axios.post(`${API_URL}/posts`, post);
};

export const getPostById = async (postId) => {
    return await axios.get(`${API_URL}/posts/${postId}`);
};

export const likePost = async (like) => {
    return await axios.post(`${API_URL}/likes`, like);
};

export const addComment = async (comment) => {
    return await axios.post(`${API_URL}/comments`, comment);
};

export const createNotification = async (notification) => {
    return await axios.post(`${API_URL}/notifications`, notification);
};

export const markNotificationAsRead = async (notificationId) => {
    return await axios.put(`${API_URL}/notifications/${notificationId}/read`);
};

export const deleteNotification = async (notificationId) => {
    return await axios.delete(`${API_URL}/notifications/${notificationId}`);
};

export const getCommentsForPost = async (postId) => {
    return await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
};


export const getNotificationForAUser =  async () =>{
    const userId = localStorage.getItem('userId');
    return await axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
};
export const deleteComment = async (commentId) => {
    return await axios.delete(`${API_URL}/comments/${commentId}`);

};

export const updateComment = async (commentId, newText) => {
    const response = await axios.put(`${API_URL}/comments/${commentId}`, {
        text: newText
    });
    return response.data;
};






const api = axios.create({
    baseURL: 'http://localhost:8081',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
