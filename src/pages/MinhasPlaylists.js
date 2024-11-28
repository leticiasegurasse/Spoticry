import React, { useState, useEffect } from "react";
import { fetchAllPlaylistsArray } from "../services/playlistService"; // Importa o serviço
import { jwtDecode } from "jwt-decode";
import PlaylistTable from "../components/PlaylistTable";
import styles from "./MinhasPlaylists.module.css";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

// Função para recuperar o userId do token
const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.id);
    return decodedToken.id; // Substitua 'id' pelo nome correto no seu payload JWT
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

function MinhasPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]); // Playlists filtradas para busca
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Query de busca
  const [currentPage, setCurrentPage] = useState(0); // Página atual
  const itemsPerPage = 10; // Máximo de 10 playlists por página

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token); // Usa a função para obter o userId

      if (!userId) {
        setFeedback("Erro: Usuário não autenticado.");
        return;
      }

      try {
        const allPlaylists = await fetchAllPlaylistsArray(); // Usa o serviço para buscar playlists
        const userPlaylists = allPlaylists.filter(
          (playlist) => playlist._userId === userId
        ); // Filtra playlists do usuário

        console.log(userPlaylists, allPlaylists);
        setPlaylists(userPlaylists);
        setFilteredPlaylists(userPlaylists);
      } catch (error) {
        console.error("Erro ao buscar playlists do usuário:", error);
        setFeedback("Erro ao carregar suas playlists.");
      }
    };

    fetchPlaylists();
  }, []);

  // Função para lidar com a busca
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = playlists.filter(
      (playlist) =>
        playlist._name.toLowerCase().includes(query) ||
        playlist._description.toLowerCase().includes(query)
    );
    setFilteredPlaylists(filtered);
    setCurrentPage(0); // Reinicia na primeira página
  };

  // Funções de navegação para a paginação
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredPlaylists.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Playlists exibidas na página atual
  const startIndex = currentPage * itemsPerPage;
  const paginatedPlaylists = filteredPlaylists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerPrincipal}>
        <NavBar />

        {/* Barra de busca */}
        <input
          type="text"
          placeholder="Pesquisar por nome ou descrição..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />

        {/* Feedback */}
        {feedback && <p>{feedback}</p>}

        {/* Lista de Playlists */}
        <div>
          <div className="flex justify-content-between align-items-center">
            <h3>Minhas Playlists</h3>
            {/* Botão Ver Minhas Playlists */}
            <Link to="/add-playlist">
              <button className={styles.paginationButton}>
                Adicionar Playlist
              </button>
            </Link>
          </div>

          <table className={styles.playlistTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlaylists.map((playlist, index) => (
                <PlaylistTable
                  key={playlist._id}
                  playlist={playlist}
                  index={startIndex + index}
                />
              ))}
            </tbody>
          </table>
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
            {Math.ceil(filteredPlaylists.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              (currentPage + 1) * itemsPerPage >= filteredPlaylists.length
            }
            className={styles.paginationButton}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

export default MinhasPlaylists;
