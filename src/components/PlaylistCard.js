import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PlaylistCardContainer = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
  width: 200px;
  margin: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
`;

const PlaylistCard = ({ playlist }) => (
  <PlaylistCardContainer>
    <Link to={`/playlists/${playlist._id}`}>
      <PlaylistImage src={playlist.cover} alt={playlist._name} />
      <h3>{playlist._name}</h3>
    </Link>
      <p>{playlist._description}</p>
  </PlaylistCardContainer>
);

export default PlaylistCard;
