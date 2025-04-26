import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // ✏️ Change according to your backend URL
});

export default API;
