import React from 'react';
import styles from './MusicCard.module.css';

function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null; // Retorna o ID ou null se não encontrar
}

function MusicCard({ musica, onClick }) {
    const videoId = getYouTubeVideoId(musica.url);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://picsum.photos/200/120';

    // Função para limitar o texto a no máximo 10 caracteres
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <li className={styles.musicCard} onClick={onClick}>
            {thumbnailUrl && (
                <img 
                    src={thumbnailUrl} 
                    alt="Miniatura do Vídeo do YouTube"
                    className={styles.thumbnail}
                />
            )}
            <div className={styles.info}>
                <h3 className={styles.title}>{truncateText(musica.title, 15)}</h3>
                <p className={styles.artist}>{truncateText(musica.artist, 20)}</p>
            </div>
            <button className={styles.playButton} onClick={() => console.log('Play clicked!')}>
                ▶
            </button>
        </li>
    );
}


export default MusicCard;
