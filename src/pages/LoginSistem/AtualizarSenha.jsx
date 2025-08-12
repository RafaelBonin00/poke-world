// src/pages/AtualizarSenha.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

import SenhaRequirementos from './componentes/SenhaRequirementos';
import InputCadastro from './componentes/InputCadastro';

export default function AtualizarSenha() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setCarregando(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCarregando(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const senhaValida =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special &&
    form.password === form.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (name === 'password') {
      setPasswordChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  

  const handleAtualizarSenha = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!senhaValida) {
      setErro('A senha não atende aos requisitos.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: form.password });

    if (error) {
      setErro('Erro ao atualizar a senha: ' + error.message);
    } else {
      setSucesso('Senha atualizada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (carregando) {
    return <p>Carregando sessão de redefinição...</p>;
  }

  return (
    <div>
      <Link to="/noticias">Noticias</Link>
      <h2>Atualizar Senha</h2>
      <form onSubmit={handleAtualizarSenha}>

        <InputCadastro name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} />
        <InputCadastro name="confirmPassword" type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={handleChange}/>
        <button type="submit">Atualizar</button>
      </form>

      <SenhaRequirementos checks={passwordChecks} password={form.password} confirmPassword={form.confirmPassword}/>

      {/* Mensagens */}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      <p>
        Lembrou da senha? <Link to="/">Entrar</Link>
      </p>
    </div>
  );
}
