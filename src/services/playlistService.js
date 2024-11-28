import api from '../utils/api';
import { getToken } from './authService';

export async function fetchAllPlaylists() {
    try {
        const token = getToken();
        const response = await api.get('/playlist', {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna as playlists em caso de sucesso
    } catch (error) {
        console.error('Erro ao buscar playlists:', error);
        throw new Error('Não foi possível carregar as playlists.'); // Propaga o erro
    }
}

export async function fetchAllPlaylistsArray() {
    try {
        const token = getToken();
        const response = await api.get('/playlist', {
            headers: {
                Authorization: token,
            },
        });
        // Garante que o retorno seja um array
        return response.data.playlists || [];
    } catch (error) {
        console.error('Erro ao buscar playlists:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

export async function fetchPlaylistsId(playlistId) {
    try {
        const token = getToken();
        const response = await api.get(`/playlist/${playlistId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a confirmação da exclusão
    } catch (error) {
        console.error('Erro ao buscar playlist:', error);
        throw new Error('Não foi possível buscar a playlist.'); // Propaga o erro
    }
}


export async function addPlaylist(playlistData) {
    try {
        const token = getToken();
        const response = await api.post('/playlist', playlistData, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a playlist criada em caso de sucesso
    } catch (error) {
        console.error('Erro ao adicionar playlist:', error);
        throw new Error('Não foi possível adicionar a playlist.'); // Propaga o erro
    }
}

export async function editPlaylist(playlistId, playlistData) {
    try {
        const token = getToken();
        const response = await api.put(`/playlist/${playlistId}`, playlistData, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a playlist atualizada
    } catch (error) {
        console.error('Erro ao editar playlist:', error);
        throw new Error('Não foi possível editar a playlist.'); // Propaga o erro
    }
}

export async function deletePlaylist(playlistId) {
    try {
        const token = getToken();
        const response = await api.delete(`/playlist/${playlistId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a confirmação da exclusão
    } catch (error) {
        console.error('Erro ao deletar playlist:', error);
        throw new Error('Não foi possível deletar a playlist.'); // Propaga o erro
    }
}

export async function addMusicToPlaylist(playlistId, musicId) {
    try {
        const token = getToken();
        const response = await api.post(`/playlist/${playlistId}/song`, { musicId }, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a confirmação de adição
    } catch (error) {
        console.error('Erro ao adicionar música à playlist:', error);
        throw new Error('Não foi possível adicionar a música à playlist.'); // Propaga o erro
    }
}

export async function removeMusicFromPlaylist(playlistId, musicId) {
    try {
        const token = getToken();
        const response = await api.delete(`/playlist/${playlistId}/song/${musicId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Retorna a confirmação de remoção
    } catch (error) {
        console.error('Erro ao remover música da playlist:', error);
        throw new Error('Não foi possível remover a música da playlist.'); // Propaga o erro
    }
}
