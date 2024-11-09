import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom'; // Altere useHistory para useNavigate
import Feedback from '../components/Feedback';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // useHistory substituído por useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            navigate('/home'); // useNavigate para redirecionamento sem recarregar a página
        } catch (error) {
            setError('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
            </form>
            {error && <Feedback message={error} type="error" />}
        </div>
    );
}

export default Login;
