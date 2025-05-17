import api from "./api.js";

export const login = async (email, password) => {
    const response = await api.post('/api/users/login', {
        email,
        password
    });


    return response.data.result;
}