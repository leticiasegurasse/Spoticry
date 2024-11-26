import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PlaylistCard.module.css';

// Função utilitária para truncar texto
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Função para transformar a primeira letra em maiúscula
const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const PlaylistCard = ({ playlist }) => (
    <div className={styles.playlistCardContainer}>
        <Link to={`/playlists/${playlist._id}`} className={styles.playlistInfo}>
            <img 
                src="https://picsum.photos/200/120" 
                alt={playlist._name} 
                className={styles.playlistImage} 
            />
            <div>
                <h3>{capitalizeFirstLetter(truncateText(playlist._name, 10))}</h3> {/* Formata a primeira letra e limita a 10 caracteres */}
            </div>
            <button className={styles.playButton} onClick={() => console.log('Play clicked!')}>
                ▶
            </button>
        </Link>
    </div>
);

export default PlaylistCard;
