import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleResetPassword = async () => {
    setMensagem('');
    setErro('');

    if (!user?.email) {
      setErro('Usuário sem email válido.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/atualizar-senha`, // redireciona para sua página após o clique no link
    });

    if (error) {
      setErro('Erro ao enviar email: ' + error.message);
    } else {
      setMensagem('Por favor, verifique seu email para redefinir a senha.');
    }
  };

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <Link to="/noticias">Ir para Notícias</Link>
      <h2>Bem-vindo, {user.user_metadata?.firstName} {user.user_metadata?.lastName}</h2>
      <p>Dados cadastrais</p>
      <p>Email: {user.email}</p>

      {/* Botão de redefinir senha */}
      <p>

        <button onClick={handleResetPassword}>Redefinir senha</button>

        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </p>
      <p>
      <button onClick={handleLogout}>Sair</button>
      </p>
    </div>
  );
}
