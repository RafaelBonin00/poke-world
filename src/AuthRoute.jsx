// src/AuthRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function AuthRoute({ children, type }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (type === 'private' && !session) {
    return <Navigate to="/login" />;
  }

  if (type === 'public' && session) {
    return <Navigate to="/" />;
  }

  return children;
}
