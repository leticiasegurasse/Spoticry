import React, { useEffect, useState } from 'react';
import { fetchAllMusic } from '../services/musicService';
import Feedback from '../components/Feedback';
import MusicCard from '../components/MusicCard';
import styles from './MusicList.module.css';
import { logoutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function MusicList() {
    const [musicas, setMusicas] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Query de busca
    const [currentPage, setCurrentPage] = useState(0); // Página atual
    const itemsPerPage = 10; // Número de músicas por página
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
                                Ver Minhas Musicas
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
                                    <MusicCard key={musica.id} musica={musica} />
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
        </div>
    );
}

export default MusicList;
