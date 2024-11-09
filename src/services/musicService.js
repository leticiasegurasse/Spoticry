// src/services/musicService.js
import api from '../utils/api';
import { getToken } from './authService';

export async function fetchAllMusic() {
    try {
        const token = getToken();
        const response = await api.get('/song', {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        return []; // Retorna um array vazio em caso de erro
    }
    

}

export function addMusic(musicData) {
    const token = getToken();
    return api.post('/song', musicData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function editMusic(musicId, musicData) {
    const token = getToken();
    return api.put(`/song/${musicId}`, musicData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export function deleteMusic(musicId) {
    const token = getToken();
    return api.delete(`/song/${musicId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}
