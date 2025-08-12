// src/Rotas/Rotas.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Login from '../pages/LoginSistem/Login';
import Cadastro from '../pages/LoginSistem/Cadastro';
import Noticias from '../pages/LoginSistem/Noticias';
import Perfil from '../pages/LoginSistem/Perfil';
import RedefinirSenha from '../pages/LoginSistem/RedefinirSenha';
import AtualizarSenha from '../pages/LoginSistem/AtualizarSenha';
import AuthRoute from '../AuthRoute';
import EscolherEquipe from '../pages/EscolherEquipe/EscolherEquipe';
import Capturar from '../pages/Capturar/Capturar';
import Maps from '../pages/Maps/Maps.jsx';
import AttBanco from '../pages/AdminSistem/AttBanco';
import Capturar_Page from '../pages/Capturar/Capturar';
import Combate from '../pages/Combate/Combate.jsx';

export default function Rotas() {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route path="/" element={<Dashboard />} />

      {/* Página de perfil protegida */}
      <Route
        path="/perfil"
        element={
          <AuthRoute type="private">
            <Perfil />
          </AuthRoute>
        }
      />

      {/* Login e cadastro protegidos por PublicRoute */}
      <Route
        path="/login"
        element={
          <AuthRoute type="public">
            <Login />
          </AuthRoute>
        }
      />
       <Route
        path="/cadastro"
        element={
          <AuthRoute type="public">
            <Cadastro />
          </AuthRoute>
        }
      />
      
      <Route
        path="/capturar"
        element={
          <AuthRoute type="private">
            <Capturar_Page/>
          </AuthRoute>
        }
      />

      <Route
        path="/combate"
        element={
          <AuthRoute type="private">
            <Combate/>
          </AuthRoute>
        }
      />
      <Route
        path="/redefinir-senha"
        element={
          <AuthRoute type="public">
            <RedefinirSenha />
          </AuthRoute>
        }
      />
      <Route
        path="/atualizar-senha"
        element={
          <AuthRoute type="private">
            <AtualizarSenha />
          </AuthRoute>
        }
      />

      <Route
        path="/escolher-equipe"
        element={
          <AuthRoute type="private">
            <EscolherEquipe />
          </AuthRoute>
        }
      />
      <Route
        path="/capturar"
        element={
          <AuthRoute type="private">
            < Capturar/>
          </AuthRoute>
        }
      />
      <Route
        path="/maps"
        element={
          <AuthRoute type="private">
            < Maps/>
          </AuthRoute>
        }
      />
      <Route
        path="/AttBanco"
        element={
          <AuthRoute type="private">
            < AttBanco/>
          </AuthRoute>
        }
      />
      {/* Página de notícias (pública) */}
      <Route path="/noticias" element={<Noticias />} />

      {/* Redirecionamento de rota inválida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
