// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Erro ao fazer login: ' + error.message);
    } else {
      navigate('/'); // redireciona para o dashboard
    }
  };

  return (
    <div>
    <Link to="/noticias">Noticias</Link>
      <h2>Entrar</h2>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Esqueceu a senha? <Link to="/redefinir-senha">Clique aqui</Link>
      </p>
      <p>
        Não tem conta? <Link to="/cadastro">Cadastrar</Link>
      </p>

    </div>
  );
}
