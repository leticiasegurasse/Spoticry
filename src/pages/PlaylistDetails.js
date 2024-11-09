import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import styled from 'styled-components';

const PlaylistDetailsContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SongItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const PlaylistDetails = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    api.get(`/playlist/${id}`)
      .then(response => setPlaylist(response.data))
      .catch(error => console.error('Erro ao carregar detalhes da playlist:', error));
  }, [id]);

  const removeSongFromPlaylist = (songId) => {
    api.delete(`/playlist/${id}/song/${songId}`)
      .then(() => {
        setPlaylist({
          ...playlist,
          songs: playlist.songs.filter(song => song.id !== songId),
        });
      })
      .catch(error => console.error('Erro ao remover música da playlist:', error));
  };

  if (!playlist) return <p>Loading...</p>;

  return (
    <PlaylistDetailsContainer>
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
      <SongList>
        {playlist.songs.map(song => (
          <SongItem key={song.id}>
            <span>{song.title} - {song.artist}</span>
            <button onClick={() => removeSongFromPlaylist(song.id)}>Remover</button>
          </SongItem>
        ))}
      </SongList>
    </PlaylistDetailsContainer>
  );
};

export default PlaylistDetails;
