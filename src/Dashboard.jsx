import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import EscolherPokemonInicial from './pages/Inicio/Inicio';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) {
    return (
      <>
        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        <p>Não tem conta? <Link to="/cadastro">Cadastrar</Link></p>
      </>
    );
  }

  return (
    <div>
      <h2>Bem-vindo, {user.email}</h2>
      <button onClick={handleLogout}>Sair</button>

      <EscolherPokemonInicial user={user} />
    </div>
  );
}
