// src/utils/api.js
import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
    baseURL: 'https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default', 
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = token; // Adiciona "Bearer" antes do token
    }
    return config;
});

export default api;
