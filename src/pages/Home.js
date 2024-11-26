import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import MusicCard from '../components/MusicCard';
import Feedback from '../components/Feedback';
import PlaylistCard from '../components/PlaylistCard'; // Importe o PlaylistCard para exibir as playlists
import { fetchAllMusic } from '../services/musicService';
import ReactPlayer from 'react-player';
import axios from 'axios';
import NavBar from "../components/NavBar";

function Home() {
    const [musicas, setMusicas] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [selectedMusic, setSelectedMusic] = useState(null); // Detalhes da música selecionada
    const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar play/pause

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
    const handleSelectMusic = (musica) => {
        setSelectedMusic(musica); // Define diretamente a música selecionada
        setIsPlaying(true); // Toca a música ao selecionar
    };

    return (
        <div className={styles.container}>
            <div className="flex justify-content-center gap10">
                <div className={styles.containerPrincipal}>
                    <NavBar />

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
                            {randomMusicas.map((musica) => (
                                <MusicCard 
                                    key={musica.id} 
                                    musica={musica} 
                                    onClick={() => handleSelectMusic(musica)} // Define diretamente a música
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
                            {latestMusicas.map((musica) => (
                                <MusicCard 
                                    key={musica.id} 
                                    musica={musica} 
                                    onClick={() => handleSelectMusic(musica)} // Define diretamente a música
                                />
                            ))}
                        </ul>
                    </span>
                </div>
            </div>
            {/* Player de Áudio */}
            <div className={styles.playMusica}>
                {selectedMusic && (
                    <ReactPlayer 
                        url={selectedMusic.url} // Usa a URL da música selecionada
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
