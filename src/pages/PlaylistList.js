import React, { useEffect, useState } from 'react';
import { fetchAllPlaylists, deletePlaylist } from '../services/playlistService';
import Feedback from '../components/Feedback';
import PlaylistCard from '../components/PlaylistCard';

function PlaylistList() {
    const [playlists, setPlaylists] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        async function loadPlaylists() {
            try {
                const response = await fetchAllPlaylists();
                setPlaylists(response.playlists || []); // Garante que `playlists` seja um array
                console.log(response.playlists); // Exibe a resposta para depuração
            } catch (error) {
                setFeedback({ message: 'Erro ao carregar playlists', type: 'error' });
                setPlaylists([]); // Define como array vazio em caso de erro
            }
        }
        loadPlaylists();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deletePlaylist(id);
            setPlaylists(playlists.filter((playlist) => playlist.id !== id));
            setFeedback({ message: 'Playlist excluída com sucesso!', type: 'success' });
        } catch {
            setFeedback({ message: 'Erro ao excluir playlist', type: 'error' });
        }
    };

    return (
        <div>
            <h2>Lista de Playlists</h2>
            {feedback && <Feedback message={feedback.message} type={feedback.type} />}
            <ul>
                {playlists.map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} onDelete={handleDelete} />
                ))}
            </ul>
        </div>
    );
}

export default PlaylistList;
