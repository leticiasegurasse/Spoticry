import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Adicionado useNavigate
import axios from "axios";
import ReactPlayer from "react-player";
import { jwtDecode } from "jwt-decode";
import styles from "./PlaylistDetails.module.css";
import NavBar from "../components/NavBar";


// Função para extrair o ID do vídeo do YouTube
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Função para formatar texto com a primeira letra maiúscula
const capitalizeFirstLetter = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

function PlaylistDetails() {
  const { id } = useParams(); // Obtém o ID da playlist da URL
  const navigate = useNavigate(); // Para redirecionar após a exclusão
  const [playlist, setPlaylist] = useState(null); // Dados da playlist
  const [songsDetails, setSongsDetails] = useState([]); // Detalhes das músicas
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(null); // Índice da música selecionada
  const [isPlaying, setIsPlaying] = useState(false); // Controle de reprodução
  const [isCreator, setIsCreator] = useState(false); // Verifica se é o criador
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal
  const [availableSongs, setAvailableSongs] = useState([]); // Músicas disponíveis
  const [searchQuery, setSearchQuery] = useState(""); // Busca no modal

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem("token");

        // Decodifica o token e obtém o userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;

        const response = await axios.get(
          `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        const playlistData = response.data.playlist;
        setPlaylist(playlistData);

        // Verifica se o usuário é o criador
        setIsCreator(playlistData._userId === userId);

        // Busca detalhes das músicas
        const songs = playlistData._songs || [];
        const songDetailsPromises = songs.map(async (songId) => {
          try {
            const songResponse = await axios.get(
              `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/song/${songId}`,
              {
                headers: { Authorization: token },
              }
            );
            return songResponse.data.song; // Ajustado para acessar `song`
          } catch (err) {
            console.error(`Erro ao carregar a música ${songId}:`, err);
            return null;
          }
        });

        const songDetails = await Promise.all(songDetailsPromises);
        setSongsDetails(songDetails.filter((detail) => detail));
      } catch (err) {
        setError("Erro ao carregar os detalhes da playlist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleRemovePlaylist = async () => {
    if (!isCreator) return; // Apenas o criador pode remover a playlist
    const confirmDelete = window.confirm(
      "Você tem certeza de que deseja apagar esta playlist? Essa ação não pode ser desfeita."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      // Redireciona após a exclusão
      alert("Playlist apagada com sucesso!");
      navigate("/minhas-playlists"); // Redireciona para a lista de playlists
    } catch (error) {
      console.error("Erro ao apagar playlist:", error);
      alert("Ocorreu um erro ao tentar apagar a playlist.");
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!isCreator) return; // Apenas o criador pode remover músicas
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist/${id}/song/${songId}`,
        {
          headers: { Authorization: token },
        }
      );

      // Atualiza as músicas localmente após a remoção
      setSongsDetails((prevSongs) => prevSongs.filter((song) => song.id !== songId));
    } catch (error) {
      console.error("Erro ao remover música:", error);
    }
  };

  const handleAddSong = async (songId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist/${id}/song`,
        { songId },
        {
          headers: { Authorization: token },
        }
      );

      // Atualiza as músicas localmente após a adição
      const addedSong = availableSongs.find((song) => song.id === songId);
      setSongsDetails((prevSongs) => [...prevSongs, addedSong]);
      setModalOpen(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
    }
  };

  const handleSelectMusic = (index) => {
    setSelectedMusicIndex(index);
    setIsPlaying(true); // Inicia a reprodução
  };

  const fetchAvailableSongs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/song",
        {
          headers: { Authorization: token },
        }
      );
      setAvailableSongs(response.data.songs || []);
    } catch (error) {
      console.error("Erro ao buscar músicas disponíveis:", error);
    }
  };

  const filteredSongs = availableSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMusicUrl =
    selectedMusicIndex !== null ? songsDetails[selectedMusicIndex]?.url : null;

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  const playlistName = capitalizeFirstLetter(playlist?._name || "Playlist sem título");
  const playlistDescription = capitalizeFirstLetter(playlist?._description || "Sem descrição");

  const firstSongThumbnail =
    songsDetails.length > 0
      ? `https://img.youtube.com/vi/${getYouTubeVideoId(
          songsDetails[0]?.url
        )}/hqdefault.jpg`
      : "https://picsum.photos/200/200";

  return (
    <div className={styles.container}>
      <div className={styles.containerPrincipal}>
        <NavBar />

        <div className="flex align-items-start justify-content-between">
          <div className="flex align-items-center gap40">
            <img
              src={firstSongThumbnail}
              alt={playlistName}
              className={styles.playlistImage}
            />
            <span>
              <h1>{playlistName}</h1>
              <p>{playlistDescription}</p>
            </span>
          </div>
          {isCreator && (
          <button className={styles.removeButton} onClick={handleRemovePlaylist}>
            Apagar Playlist
          </button>
          )}
        </div>

        {isCreator && (
            <button
              className={styles.addButton}
              onClick={() => {
                setModalOpen(true);
                fetchAvailableSongs();
              }}
            >
              + Adicionar Músicas
            </button>
            
        )}

        <table className={styles.playlistTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Artista</th>
              {isCreator && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {songsDetails.length === 0 ? (
              <p>Nenhuma música encontrada.</p>
            ) : (
              songsDetails.map((song, index) => (
                <tr
                  key={song.id}
                  onClick={() => handleSelectMusic(index)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                        song.url
                      )}/hqdefault.jpg`}
                      alt={song.title}
                      className={styles.thumbnail}
                    />
                  </td>
                  <td>
                    <strong>{song.title}</strong>
                  </td>
                  <td>{song.artist}</td>
                  {isCreator && (
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSong(song.id);
                        }}
                        className={styles.removeButton}
                      >
                        Remover
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
            <input
              type="text"
              placeholder="Buscar músicas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchBar}
            />
            <ul className={styles.songList}>
              {filteredSongs.map((song) => (
                <li key={song.id}>
                  <div>
                    <strong>{song.title}</strong> - {song.artist}
                  </div>
                  <button
                    className={styles.addSongButton}
                    onClick={() => handleAddSong(song.id)}
                  >
                    Adicionar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistDetails;
