import React, { useState, useEffect } from 'react';
import { loginUser, getToken, isTokenValid } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Feedback from '../components/Feedback';
import styles from './Login.module.css'; // Importa o CSS Module
import icon from '../assets/img/icon.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token || !isTokenValid(token)) {
            localStorage.removeItem('token'); // Remove token inválido
            navigate('/login'); // Redireciona para login
        }else {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedbackMessage('Carregando...');
        setFeedbackType('loading');
        try {
            await loginUser(email, password);
            navigate('/home');
        } catch (error) {
            console.error("Erro de login:", error);
            setFeedbackMessage('Falha no login. Verifique suas credenciais.');
            setFeedbackType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}> {/* Altere o uso de classes para usar CSS Modules */}
            <div className={styles.loginContainer}>
                {isLoading && (
                    <div className={styles.loaderOverlay}>
                        <div className={styles.loader}></div>
                    </div>
                )}
                <img src={icon} alt="Logo Spotcry" className={styles.iconLogo} />
                <h2>Entrar no Spotcry</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Entrar</button>
                </form>
                {feedbackMessage && (
                    <Feedback message={feedbackMessage} type={feedbackType} style={{ marginTop: '10px' }} />
                )}
            </div>
        </div>
    );
}

export default Login;
