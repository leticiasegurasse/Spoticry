import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import styles from './Home.module.css';
import MusicCard from '../components/MusicCard';
import Feedback from '../components/Feedback';
import PlaylistCard from '../components/PlaylistCard'; // Importe o PlaylistCard para exibir as playlists
import { fetchAllMusic } from '../services/musicService';
import ReactPlayer from 'react-player';
import axios from 'axios';

function Home() {
    const [musicas, setMusicas] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [selectedMusicIndex, setSelectedMusicIndex] = useState(null); // Índice da música selecionada
    const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar play/pause
    const navigate = useNavigate();

    // Chamada para buscar músicas da API
    useEffect(() => {
        async function loadMusicas() {
            try {
                const response = await fetchAllMusic();
                setMusicas(response.songs || []);
                console.log("Músicas carregadas:", response.songs);
            } catch (error) {
                setFeedback({ message: 'Erro ao carregar músicas', type: 'error' });
                setMusicas([]);
            }
        }
        loadMusicas();
    }, []);

    // Chamada para buscar playlists da API
    useEffect(() => {
        async function loadPlaylists() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    'https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist',
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setPlaylists(response.data.playlists || []);
            } catch (error) {
                console.error('Erro ao carregar playlists:', error);
            }
        }
        loadPlaylists();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Função para embaralhar as músicas e selecionar 6 aleatórias
    const getRandomMusicas = (allMusicas, count = 6) => {
        const shuffled = [...allMusicas].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Músicas aleatórias
    const randomMusicas = getRandomMusicas(musicas);

    // 6 últimas músicas adicionadas
    const latestMusicas = musicas.slice(-6).reverse(); // Pega as últimas 6 músicas e inverte a ordem

    // Define a música selecionada para tocar
    const handleSelectMusic = (index) => {
        setSelectedMusicIndex(index);
        setIsPlaying(true); // Toca a música ao selecionar
    };

    // URL da música selecionada
    const selectedMusicUrl = selectedMusicIndex !== null ? randomMusicas[selectedMusicIndex]?.url : null;

    return (
        <div className={styles.container}>
            <div className="flex justify-content-center gap10">
                <div className={styles.containerPrincipal}>
                    <nav className="navBarContainer">
                        <ul className="menuContainer">
                            <li><a href='/home' className="menuCheck">Tudo</a></li>
                            <li><a href='/musicas'>Músicas</a></li>
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

                    {/* Playlists */}
                    <span>
                        <div className={styles.playlistList}>
                            {playlists.slice(-8).reverse().map((playlist) => (
                                <PlaylistCard key={playlist._id} playlist={playlist} />
                            ))}
                        </div>
                    </span>


                    {/* Músicas Recomendadas */}
                    <span>
                        <h3>Músicas Recomendadas</h3>
                        <ul className={styles.musicList}>
                            {randomMusicas.map((musica, index) => (
                                <MusicCard 
                                    key={musica.id} 
                                    musica={musica} 
                                    onClick={() => handleSelectMusic(index)} // Define o índice da música selecionada
                                />
                            ))}
                        </ul>
                    </span>

                    {/* Adicionadas Recentemente */}
                    <span>
                        <div className="flex justify-content-between">
                            <h3>Adicionadas Recentemente</h3>
                            <a href='/musicas' className={styles.btnMostrarTudo}>Mostrar tudo</a>
                        </div>
                        <ul className={styles.musicList}>
                            {latestMusicas.map((musica, index) => (
                                <MusicCard 
                                    key={musica.id} 
                                    musica={musica} 
                                    onClick={() => handleSelectMusic(index)} // Define o índice da música selecionada
                                />
                            ))}
                        </ul>
                    </span>
                </div>
            </div>
            {/* Player de Áudio */}
            <div className={styles.playMusica}>
                {selectedMusicUrl && (
                    <ReactPlayer 
                        url={selectedMusicUrl} 
                        playing={isPlaying}
                        controls={true}
                        width="100%"
                        height="50px"
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        config={{ youtube: { playerVars: { autoplay: 1, controls: 1 } } }}
                    />
                )}
            </div>
            {feedback && <Feedback message={feedback.message} type={feedback.type} />}
        </div>
    );
}

export default Home;
