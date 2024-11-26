import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PlaylistTable.module.css';

// Função utilitária para truncar texto
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Função para transformar a primeira letra em maiúscula
const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const PlaylistCard = ({ playlist, index }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/playlists/${playlist._id}`); // Navega para o link da playlist
    };

    return (
        <tr className={styles.playlistRow} onClick={handleRowClick}>
            <td>{index + 1}</td> {/* Exibe o índice incrementado para começar de 1 */}
            <td>
                <img 
                    src="https://picsum.photos/200/120" 
                    alt={playlist._name} 
                    className={styles.playlistImage} 
                />
            </td>
            <td>
                <h3>{capitalizeFirstLetter(truncateText(playlist._name, 20))}</h3>
            </td>
            <td>
                <p>{truncateText(playlist._description, 50)}</p>
            </td>
        </tr>
    );
};

export default PlaylistCard;
