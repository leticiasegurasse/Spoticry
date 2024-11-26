import React, { useState, useEffect } from "react";
import styles from "./AddPlaylist.module.css";
import NavBar from "../components/NavBar";
import { addPlaylist } from "../services/playlistService"; // Importa funções do serviço
import { fetchAllMusic } from "../services/musicService"; // Importa função para buscar músicas

function AddPlaylist() {
  const [songs, setSongs] = useState([]); // Todas as músicas
  const [selectedSongs, setSelectedSongs] = useState([]); // Músicas selecionadas
  const [searchQuery, setSearchQuery] = useState(""); // Query de busca
  const [playlistName, setPlaylistName] = useState(""); // Nome da playlist
  const [playlistDescription, setPlaylistDescription] = useState(""); // Descrição da playlist
  const [feedback, setFeedback] = useState(null); // Feedback para o usuário

  useEffect(() => {
    // Busca todas as músicas
    const fetchSongs = async () => {
      try {
        const allSongs = await fetchAllMusic(); // Usa a função do serviço de músicas
        setSongs(allSongs.songs || []); // Garante que seja um array
      } catch (error) {
        console.error("Erro ao carregar músicas:", error);
        setFeedback("Erro ao carregar músicas.");
      }
    };

    fetchSongs();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filtra as músicas com base no nome e no artista
  const filteredSongs = songs.filter((song) => {
    const nameMatch = song.title?.toLowerCase().includes(searchQuery);
    const artistMatch = song.artist?.toLowerCase().includes(searchQuery);
    return nameMatch || artistMatch;
  });

  const handleSongSelect = (songId) => {
    setSelectedSongs((prevSelected) =>
      prevSelected.includes(songId)
        ? prevSelected.filter((id) => id !== songId) // Remove se já estiver selecionado
        : [...prevSelected, songId] // Adiciona caso contrário
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Supondo que o ID do usuário esteja no localStorage

    const payload = {
      userId,
      songs: selectedSongs,
      description: playlistDescription,
      name: playlistName,
    };

    try {
      await addPlaylist(payload); // Usa a função do serviço para adicionar a playlist
      setFeedback("Playlist criada com sucesso!");
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedSongs([]);
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      setFeedback("Erro ao criar playlist. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
        <NavBar/>
        <div className={styles.formContainer}>
            <h1>Nova Playlist</h1>
            {feedback && <p className={styles.feedback}>{feedback}</p>}
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nome da Playlist"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                required
                className={styles.input}
            />
            <textarea
                placeholder="Descrição da Playlist"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                required
                className={styles.textarea}
            />

            {/* Barra de busca */}
            <input
                type="text"
                placeholder="Pesquisar músicas..."
                value={searchQuery}
                onChange={handleSearch}
                className={styles.searchBar}
            />

            {/* Lista de músicas */}
            <div className={styles.songsList}>
                {filteredSongs.map((song) => (
                <label key={song.id} className={styles.songItem}>
                    <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSongSelect(song.id)}
                    />
                    <span>
                    <strong>{song.title}</strong> - {song.artist}
                    </span>
                </label>
                ))}
            </div>

            <button type="submit" className={styles.submitButton}>
                Criar Playlist
            </button>
            </form>
        </div> 
    </div>
  );
}

export default AddPlaylist;
