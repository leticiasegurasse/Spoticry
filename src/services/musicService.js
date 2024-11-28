// src/services/musicService.js
import api from '../utils/api';
import { getToken } from './authService';

export async function fetchAllMyMusic() {
    try {
        const token = getToken();
        const response = await api.get('/song', {
            headers: {
                Authorization: token,
            },
        });
        // Retorna diretamente o array de músicas
        return response.data.songs || []; 
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

export async function fetchAllMusic() {
    try {
        const token = getToken();
        const response = await api.get('/song', {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        throw new Error('Não foi possível buscar as músicas.'); // Propaga o erro com mensagem amigável
    }
}

export async function fetchMusicId(songId) {
    try {
        const token = getToken();
        const response = await api.get(`/song/${songId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        throw new Error('Não foi possível buscar a música.'); // Propaga o erro com mensagem amigável
    }
}


export async function addMusic(musicData) {
    try {
        const token = getToken();
        const response = await api.post('/song', musicData, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna os dados em caso de sucesso
    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        throw new Error('Erro ao adicionar música.'); // Propaga o erro
    }
}

export async function editMusic(musicId, musicData) {
    try {
        const token = getToken();
        const response = await api.put(`/song/${musicId}`, musicData, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao editar música:', error);
        throw new Error('Erro ao editar música.'); // Mensagem de erro propagada
    }
}

export async function deleteMusic(musicId) {
    try {
        const token = getToken();
        const response = await api.delete(`/song/${musicId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna confirmação de exclusão
    } catch (error) {
        console.error('Erro ao excluir música:', error);
        throw new Error('Erro ao excluir música.'); // Propaga o erro
    }
}
