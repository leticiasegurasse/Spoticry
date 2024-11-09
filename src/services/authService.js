import api from '../utils/api';

export async function loginUser(email, password) {
    const response = await api.post('/user/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
}

export function logoutUser() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}