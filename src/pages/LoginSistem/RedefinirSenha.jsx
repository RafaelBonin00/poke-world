// src/pages/RedefinirSenha.jsx
import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function RedefinirSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleRedefinir = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`
    });

    if (error) {
      setErro('Erro ao enviar email de redefinição: ' + error.message);
    } else {
      setMensagem('Email de redefinição enviado com sucesso!');
    }
  };

  return (
    <div>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleRedefinir}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar link</button>
      </form>
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
}
