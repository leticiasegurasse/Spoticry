import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import MusicCard from "../components/MusicCard";
import styles from "./MinhasMusicas.module.css";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

// Função para recuperar o userId do token
const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id; // Substitua 'id' pelo nome correto no seu payload JWT
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

function MinhasMusicas() {
  const [musicas, setMusicas] = useState([]);
  const [filteredMusicas, setFilteredMusicas] = useState([]); // Músicas filtradas para busca
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Query de busca
  const [currentPage, setCurrentPage] = useState(0); // Página atual
  const itemsPerPage = 10; // Máximo de 10 músicas por página
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token); // Usa a função para obter o userId

    if (!userId) {
      setFeedback("Erro: Usuário não autenticado.");
      return;
    }

    axios
      .get(
        `https://seu-endpoint-api.com/musicas/user/${userId}`, // Substitua pelo endpoint correto
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        setMusicas(res.data.musicas || []); // Garante que músicas seja um array
        setFilteredMusicas(res.data.musicas || []); // Inicializa as músicas filtradas
      })
      .catch((err) => {
        console.error("Erro ao buscar músicas do usuário:", err);
        setFeedback("Erro ao carregar suas músicas.");
      });
  }, []);

  // Função para lidar com a busca
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = musicas.filter(
      (musica) =>
        musica.name?.toLowerCase().includes(query) ||
        musica.artist?.toLowerCase().includes(query)
    );
    setFilteredMusicas(filtered);
    setCurrentPage(0); // Reinicia na primeira página
  };

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

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Músicas exibidas na página atual
  const startIndex = currentPage * itemsPerPage;
  const paginatedMusicas = filteredMusicas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerPrincipal}>
        <nav className="navBarContainer">
          <ul className="menuContainer">
            <li>
              <a href="/home">Tudo</a>
            </li>
            <li>
              <a href="/musicas" className="menuCheck">
                Músicas
              </a>
            </li>
            <li>
              <a href="/playlists">Playlists</a>
            </li>
          </ul>
          <button onClick={handleLogout} className="logoutButton">
            Logout
          </button>
        </nav>
        {/* Barra de busca */}
        <input
          type="text"
          placeholder="Pesquisar por nome ou artista..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />

        {/* Feedback */}
        {feedback && <p>{feedback}</p>}

        {/* Lista de Músicas */}
        <div>
          <h3>Minhas Músicas</h3>
          <div className={styles.musicGrid}>
            {paginatedMusicas.map((musica, index) => (
              <MusicCard key={musica.id} musica={musica} />
            ))}
          </div>
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
    </div>
  );
}

export default MinhasMusicas;
