import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pega o usuário atual quando o componente monta
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Escuta mudanças no estado de autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Limpa o listener ao desmontar o componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  if (!user) return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/login" style={styles.link}>Entrar</Link>
        <Link to="/cadastro" style={styles.link}>Criar conta</Link>
      </nav>
    </header>
  );

  return (
    <div>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Inicio</Link>
          <Link to="/maps" style={styles.link}>Mapa</Link>
          <Link to="/escolher-equipe" style={styles.link}>Minha Equipe</Link>
          <p style={styles.text}>Bem-vindo, </p>
          <Link to="/perfil" style={styles.link}>{user.user_metadata?.firstName}</Link>
        </nav>
      </header>
    </div>
  );
}

const styles = {
  header: {
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc'
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    margin: 0,
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  },
  main: {
    padding: '2rem'
  },
  link: {
    margin: 0,
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    borderBottom: '1px solid black'
  }
};
