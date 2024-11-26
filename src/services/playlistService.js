import api from '../utils/api';
import { getToken } from './authService';

export async function fetchAllPlaylists() {
    try {
        const token = getToken();
        const response = await api.get('/playlist', {
            headers: {
                Authorization: token
            }
        });
        return response.data;

    } catch (error) {
        console.error('Erro ao buscar playlist:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

export function addPlaylist(playlistData) {
    const token = getToken();
    return api.post('/playlist', playlistData, {
        headers: {
            Authorization: token
        }
    });
}

export function editPlaylist(playlistId, playlistData) {
    const token = getToken();
    return api.put(`/playlist/${playlistId}`, playlistData, {
        headers: {
            Authorization: token
        }
    });
}

export function deletePlaylist(playlistId) {
    const token = getToken();
    return api.delete(`/playlist/${playlistId}`, {
        headers: {
            Authorization: token
        }
    });
}

export function addMusicToPlaylist(playlistId, musicId) {
    const token = getToken();
    return api.post(`/playlist/${playlistId}/song`, { musicId }, {
        headers: {
            Authorization: token
        }
    });
}

export function removeMusicFromPlaylist(playlistId, musicId) {
    const token = getToken();
    return api.delete(`/playlist/${playlistId}/song/${musicId}`, {
        headers: {
            Authorization: token
        }
    });
}
