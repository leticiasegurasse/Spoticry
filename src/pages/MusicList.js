import React, { useEffect, useState } from 'react';
import { fetchAllMusic } from '../services/musicService';
import Feedback from '../components/Feedback';
import MusicCard from '../components/MusicCard';
import styles from './MusicList.module.css';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function MusicList() {
    const [musicas, setMusicas] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();


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
    
    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // const handleDelete = async (id) => {
    //     try {
    //         await deleteMusic(id);
    //         setMusicas(musicas.filter((musica) => musica.id !== id));
    //         setFeedback({ message: 'Música excluída com sucesso!', type: 'success' });
    //     } catch {
    //         setFeedback({ message: 'Erro ao excluir música', type: 'error' });
    //     }
    // };

    return (
        <div className={styles.container}>
            <div className={styles.containerPrincipal}>
                <nav className="navBarContainer">
                    <ul className="menuContainer">
                        <li><a href='/home'>Tudo</a></li>
                        <li><a href='/musicas' className="menuCheck">Músicas</a></li>
                        <li><a href='/playlists'>Playlists</a></li>
                    </ul>
                    <button onClick={handleLogout} className="logoutButton">
                        Logout
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 512 512" 
                            className="logoutIcon"
                        >
                            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/>
                        </svg>
                    </button>
                </nav>
                <h2>Lista de Músicas</h2>
                {feedback && <Feedback message={feedback.message} type={feedback.type} />}
                {musicas.length === 0 ? (
                    <p>Nenhuma música encontrada.</p>
                ) : (
                    <ul>
                        {musicas.map((musica) => (
                            <MusicCard key={musica.id} musica={musica} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MusicList;
