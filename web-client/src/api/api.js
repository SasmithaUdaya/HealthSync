import axios from 'axios';



export const fetchPosts = async () => {
    return await api.get(`/posts`);
};

export const createPost = async (post) => {
    return await api.post(`/posts`, post);
};

export const getPostById = async (postId) => {
    return await api.get(`/posts/${postId}`);
};

export const likePost = async (like) => {
    return await api.post(`/api/likes`, like);
};

export const addComment = async (comment) => {
    return await api.post(`/api/comments`, comment);
};

export const createNotification = async (notification) => {
    return await api.post(`/notifications`, notification);
};

export const markNotificationAsRead = async (notificationId) => {
    return await api.put(`/api/notifications/${notificationId}/read`);
};

export const deleteNotification = async (notificationId) => {
    return await api.delete(`/api/notifications/${notificationId}`);
};

export const getCommentsForPost = async (postId) => {
    return await api.get(`/api/comments/post/${postId}`);
};


export const getNotificationForAUser =  async () =>{
    const userId = localStorage.getItem('userId');
    return await api.get(`/api/notifications/user/${userId}`)
};
export const deleteComment = async (commentId) => {
    return await api.delete(`/api/comments/${commentId}`);

};

export const updateComment = async (commentId, newText) => {
    const response = await api.put(`/api/comments/${commentId}`, {
        text: newText
    });
    return response.data;
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

export default api;
