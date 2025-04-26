import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081', // your API base URL
    timeout: 5000,                      // request timeout (5 seconds)
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
