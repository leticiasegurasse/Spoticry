import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService'; // Importa a função de logout
// import banner from '../assets/img/banner-spoticry.jpg';
import './Home.css';


function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser(); // Remove o token e outros dados de autenticação
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <div>
            <div className='banner'>
                <h1>Bem-vindo ao Spoticry!</h1>
            </div>
            <nav>
                <a href="/musicas">Ver músicas</a>
                <a href="/playlists">Ver playlists</a>
                <button onClick={handleLogout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
                    Logout
                </button>
            </nav>
        </div>
    );
}

export default Home;
