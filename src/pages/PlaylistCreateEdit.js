import React, { useState } from 'react';
import { addPlaylist, editPlaylist } from '../services/playlistService';
import Feedback from '../components/Feedback';

function PlaylistCreateEdit({ playlist, onSave }) {
    const [name, setName] = useState(playlist ? playlist.name : '');
    const [description, setDescription] = useState(playlist ? playlist.description : '');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const playlistData = { name, description };
            if (playlist) {
                await editPlaylist(playlist.id, playlistData);
                setFeedback({ message: 'Playlist atualizada com sucesso!', type: 'success' });
            } else {
                await addPlaylist(playlistData);
                setFeedback({ message: 'Playlist criada com sucesso!', type: 'success' });
            }
            onSave();
        } catch (error) {
            setFeedback({ message: 'Erro ao salvar a playlist', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {feedback && <Feedback message={feedback.message} type={feedback.type} />}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome da Playlist"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </form>
        </div>
    );
}

export default PlaylistCreateEdit;
