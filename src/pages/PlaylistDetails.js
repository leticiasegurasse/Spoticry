import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PlaylistDetails() {
  const { id } = useParams(); // Obtém o ID da playlist da URL
  const [playlist, setPlaylist] = useState(null); // Inicializa como null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default/playlist/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log("Resposta da API:", response.data); // Verifica a estrutura da resposta
        setPlaylist(response.data.playlist); // Define o estado com o objeto `playlist`
      } catch (err) {
        setError("Erro ao carregar os detalhes da playlist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  // Acessa os dados da playlist
  const playlistName = playlist?._name || "Playlist sem título";
  const playlistDescription = playlist?._description || "Sem descrição";

  return (
    <div>
      <h1>{playlistName}</h1>
      <p>{playlistDescription}</p>

      {/* Renderiza músicas apenas se existirem */}
      <h2>Músicas</h2>
      <ul>
        {(playlist?._songs || []).map((song) => (
          <li key={song}>
            <p>{song}</p> {/* Ajuste conforme a estrutura do item em `_songs` */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDetails;
