import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrige a importação do jwtDecode
import { useLocation, useNavigate } from "react-router-dom";
import MusicCard from "../components/MusicCard";
import { fetchAllMyMusic, deleteMusic } from "../services/musicService"; // Importa funções do musicService
import styles from "./MinhasMusicas.module.css";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

// Função para recuperar o userId do token
const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id; // Substitua por "id" ou o campo correto do seu payload JWT
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

function MinhasMusicas() {
  const [musicas, setMusicas] = useState([]);
  const [filteredMusicas, setFilteredMusicas] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.feedback) {
      setFeedback(location.state.feedback);
      setTimeout(() => {
        setFeedback(null);
        navigate(".", { replace: true });
      }, 5000);
    }

    const fetchMusicas = async () => {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        setFeedback("Erro: Usuário não autenticado.");
        return;
      }

      try {
        const allSongs = await fetchAllMyMusic(); // Chama a função do service
        console.log(allSongs);
        const userSongs = allSongs.filter((song) => song.userId === userId); // Filtra músicas do usuário
        setMusicas(userSongs);
        setFilteredMusicas(userSongs);
      } catch (error) {
        console.error("Erro ao buscar músicas do usuário:", error);
        setFeedback("Erro ao carregar suas músicas.");
      }
    };

    fetchMusicas();
  }, [location.state, navigate]);

  const handleDeleteMusic = async (id) => {
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja apagar esta música?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMusic(id); // Usa a função do service
      setFeedback("Música apagada com sucesso!");
      setMusicas((prevMusicas) => prevMusicas.filter((musica) => musica.id !== id));
      setFilteredMusicas((prevFiltered) =>
        prevFiltered.filter((musica) => musica.id !== id)
      );
    } catch (error) {
      console.error("Erro ao apagar música:", error);
      setFeedback("Erro ao apagar música.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = musicas.filter(
      (musica) =>
        musica.title?.toLowerCase().includes(query) ||
        musica.artist?.toLowerCase().includes(query)
    );
    setFilteredMusicas(filtered);
    setCurrentPage(0);
  };

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

  const startIndex = currentPage * itemsPerPage;
  const paginatedMusicas = filteredMusicas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerPrincipal}>
        <NavBar />
        <input
          type="text"
          placeholder="Pesquisar por nome ou artista..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />
        {feedback && <div className={styles.feedback}>{feedback}</div>}
        <div>
          <div className="flex justify-content-between align-items-center">
            <h3>Minhas Músicas</h3>
            <Link to="/add-musica">
              <button className={styles.paginationButton}>
                Adicionar Música
              </button>
            </Link>
          </div>
          {filteredMusicas.length === 0 ? (
            <p className={styles.noMusic}>Nenhuma música encontrada.</p>
          ) : (
            <div className={styles.musicGrid}>
              {paginatedMusicas.map((musica) => (
                <div key={musica.id}>
                  <MusicCard musica={musica} />
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteMusic(musica.id)}
                  >
                    Apagar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
