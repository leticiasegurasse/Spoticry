import React, { useEffect, useState } from 'react';
import { fetchAllMusic, deleteMusic } from '../services/musicService';
import Feedback from '../components/Feedback';
import MusicCard from '../components/MusicCard';

function MusicList() {
    const [musicas, setMusicas] = useState([]);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        async function loadMusicas() {
            try {
                const response = await fetchAllMusic();
                setMusicas(response.songs || []); // Garante que `musicas` seja um array
                console.log(response.songs); // Verifica o conteúdo das músicas no console
            } catch (error) {
                setFeedback({ message: 'Erro ao carregar músicas', type: 'error' });
                setMusicas([]); // Define como array vazio em caso de erro
            }
        }
        loadMusicas();
    }, []);
    

    const handleDelete = async (id) => {
        try {
            await deleteMusic(id);
            setMusicas(musicas.filter((musica) => musica.id !== id));
            setFeedback({ message: 'Música excluída com sucesso!', type: 'success' });
        } catch {
            setFeedback({ message: 'Erro ao excluir música', type: 'error' });
        }
    };

    return (
        <div>
            <h2>Lista de Músicas</h2>
            {feedback && <Feedback message={feedback.message} type={feedback.type} />}
            {musicas.length === 0 ? (
                <p>Nenhuma música encontrada.</p>
            ) : (
                <ul>
                    {musicas.map((musica) => (
                        <MusicCard key={musica.id} musica={musica} onDelete={handleDelete} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MusicList;
