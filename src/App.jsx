import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import Sidebar from "./components/Sidebar/sidebar";
import Header from "./components/Header/header";
import ClienteCad from "./pages/clienteCad/CliCad";
import CorretorCad from "./pages/corretoraCad/correcad";
import UsuarioCad from "./pages/usuarioCad/usuariocad";
import SeguradoraCad from "./pages/SeguradoraCad/SeguradoraCad";
import ProtectedRoute from "./utils/ProtectedRoute"; // Importa o componente
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verifica se o token JWT está no localStorage
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token); // Define como verdadeiro se houver token
  }, [location]); // Atualiza o estado ao navegar entre páginas

  const handleLogout = () => {
    // Limpa o localStorage e redefine o estado de autenticação
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redireciona para a página de login
  };

  return (
    <div className="App">
      {isAuthenticated && location.pathname !== "/login" && (
        <>
          <Sidebar />
          <Header handleLogout={handleLogout} />
        </>
      )}
      <div
        className={
          isAuthenticated && location.pathname !== "/login"
            ? "main-content"
            : ""
        }
      >
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota Protegida: Página Inicial */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="homepage">
                  <h1>Sisegg</h1>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Outras rotas protegidas */}
          <Route
            path="/clientecad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ClienteCad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/corretoracad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CorretorCad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuariocad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UsuarioCad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seguradoracad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SeguradoraCad />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
