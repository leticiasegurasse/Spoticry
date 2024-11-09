import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import styled from 'styled-components';

const MusicDetailsContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const MusicDetails = () => {
  const { id } = useParams();
  const [music, setMusic] = useState(null);

  useEffect(() => {
    api.get(`/song/${id}`)
      .then(response => setMusic(response.data))
      .catch(error => console.error('Erro ao carregar detalhes da música:', error));
  }, [id]);

  if (!music) return <p>Loading...</p>;

  return (
    <MusicDetailsContainer>
      <h2>{music.title}</h2>
      <p><strong>Artist:</strong> {music.artist}</p>
      <p><strong>Album:</strong> {music.album}</p>
      <p><strong>Duration:</strong> {music.duration}</p>
    </MusicDetailsContainer>
  );
};

export default MusicDetails;
