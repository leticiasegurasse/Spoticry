import React, { useEffect, useState } from 'react';
import { fetchAllMusic } from '../services/musicService';
import Feedback from '../components/Feedback';
import MusicCard from '../components/MusicCard';
import styles from './MusicList.module.css';
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import ReactPlayer from 'react-player';

function MusicList() {
    const [musicas, setMusicas] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Query de busca
    const [currentPage, setCurrentPage] = useState(0); // Página atual
    const [selectedMusic, setSelectedMusic] = useState(null); // Música selecionada
    const [isPlaying, setIsPlaying] = useState(false); // Estado de reprodução
    const itemsPerPage = 10; // Número de músicas por página

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

    // Função para lidar com a busca
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(0); // Reinicia na primeira página ao realizar uma busca
    };

    // Filtra as músicas com base no nome e no artista
    const filteredMusicas = musicas.filter((musica) => {
        const nameMatch = musica.title?.toLowerCase().includes(searchQuery);
        const artistMatch = musica.artist?.toLowerCase().includes(searchQuery);
        return nameMatch || artistMatch;
    });

    // Calcula o índice inicial e final para a página atual
    const startIndex = currentPage * itemsPerPage;
    const paginatedMusicas = filteredMusicas.slice(startIndex, startIndex + itemsPerPage);

    // Funções de navegação para a paginação
    const handleNextPage = () => {
        if ((currentPage + 1) * itemsPerPage < filteredMusicas.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Define a música selecionada para tocar
    const handleSelectMusic = (musica) => {
        setSelectedMusic(musica); // Define a música selecionada
        setIsPlaying(true); // Toca a música
    };

    return (
        <div className={styles.container}>
            <div className={styles.containerPrincipal}>
                <NavBar />
                {/* Barra de Busca */}
                <input
                    type="text"
                    placeholder="Pesquisar por nome ou artista..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.searchBar}
                />
                <span>
                    <div className="flex justify-content-between align-items-center">
                        <h3>Todas as Músicas</h3>
                        <Link to="/minhas-musicas">
                            <button className={styles.paginationButton}>
                                Ver Minhas Músicas
                            </button>
                        </Link>
                    </div>
                    {feedback && <Feedback message={feedback.message} type={feedback.type} />}
                    {filteredMusicas.length === 0 ? (
                        <p>Nenhuma música encontrada.</p>
                    ) : (
                        <div>
                            <div className={styles.musicGrid}>
                                {paginatedMusicas.map((musica) => (
                                    <MusicCard 
                                        key={musica.id} 
                                        musica={musica} 
                                        onClick={() => handleSelectMusic(musica)} // Define a música clicada
                                    />
                                ))}
                            </div>
                            {/* Controles de Paginação */}
                            <div className={styles.paginationContainer}>
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className={styles.paginationButton}
                                >
                                    Anterior
                                </button>
                                <span className={styles.paginationInfo}>
                                    Página {currentPage + 1} de{" "}
                                    {Math.ceil(filteredMusicas.length / itemsPerPage)}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={(currentPage + 1) * itemsPerPage >= filteredMusicas.length}
                                    className={styles.paginationButton}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    )}
                </span>
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
        </div>
    );
}

export default MusicList;
