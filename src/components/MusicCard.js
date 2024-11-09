import React from 'react';

function MusicCard({ musica, onDelete }) {
    return (
        <li>
            <h3>{musica.title}</h3>
            <p>Artista: {musica.artist}</p>
            <p>Álbum: {musica.album}</p>
            <p>Duração: {musica.duration}</p>
            <button onClick={() => onDelete(musica.id)}>Excluir</button>
        </li>
    );
}

export default MusicCard;