import api from '../utils/api';
import {jwtDecode} from 'jwt-decode';


export async function loginUser(email, password) {
    console.log("Enviando dados de login para a API"); // Log para verificação
    try {
        const response = await api.post('/user/login', { email, password });
        console.log("Resposta da API:", response.data); // Log para ver o retorno da API
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        console.error("Erro na função loginUser:", error); // Log de erro para verificar problemas na API
        throw error;
    }
}

export function logoutUser() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isTokenValid(token) {
    try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now; // Verifica se o token ainda não expirou
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return false;
    }
}

export function isAuthenticated() {
    return !!getToken();
}