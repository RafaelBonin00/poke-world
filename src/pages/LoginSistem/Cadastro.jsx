import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import CadastroForm from './componentes/CadastroForm';

export default function Cadastro() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      setPasswordChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const errorMessage = validateField(name, value);
    setError(errorMessage || null);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName': return !value.trim() ? 'O primeiro nome é obrigatório' : '';
      case 'lastName': return !value.trim() ? 'O sobrenome é obrigatório' : '';
      case 'email': return !value.includes('@') ? 'Email inválido' : '';
      case 'confirmEmail': return value !== form.email ? 'Os e-mails não coincidem' : '';
      case 'password': return value.length < 8 ? 'A senha deve ter pelo menos 8 caracteres' : '';
      case 'confirmPassword': return value !== form.password ? 'As senhas não coincidem' : '';
      default: return '';
    }
  };

  const validateForm = () => {
    const allValid =
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.includes('@') &&
      form.email === form.confirmEmail &&
      form.password === form.confirmPassword &&
      Object.values(passwordChecks).every(Boolean);

    setIsFormValid(allValid);
  };

  useEffect(() => {
    validateForm();
  }, [form, passwordChecks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
      },
    });

    if (signUpError) {
      setError('Erro ao cadastrar: ' + signUpError.message);
      setIsSubmitting(false);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      setError('Usuário não foi criado corretamente. Verifique seu email.');
      setIsSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{
        id: userId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      }], { onConflict: ['id'] });

    if (profileError) {
      setError('Erro ao salvar perfil: ' + profileError.message);
      setIsSubmitting(false);
      return;
    }

    if (profileError) {
  setError('Erro ao salvar perfil: ' + profileError.message);
  setIsSubmitting(false);
  return;
  }

  const { error: pokesError } = await supabase
    .from('Mypokes')
    .insert([{
      user_id: userId,
      FavoritePokes: [],
      AllMyPokes: [],
      MyEquipe: [],
    }]);

if (pokesError) {
  setError('Erro ao criar dados iniciais de pokémons: ' + pokesError.message);
  setIsSubmitting(false);
  return;
}


    setSuccess('Conta criada com sucesso! Por favor, confirme seu e-mail.');
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Link to="/noticias">Notícias</Link>
      <h2>Cadastrar</h2>

      <CadastroForm 
        form={form}
        passwordChecks={passwordChecks}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
        isSubmitting={isSubmitting}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}
