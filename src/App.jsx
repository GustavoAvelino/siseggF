import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import Sidebar from "./components/Sidebar/sidebar";
import Header from "./components/Header/header";
import ClienteCad from "./pages/clienteCad/CliCad";
import CorretorCad from "./pages/corretoraCad/correcad";
import UsuarioCad from "./pages/usuarioCad/usuariocad";
import SeguradoraCad from "./pages/SeguradoraCad/SeguradoraCad";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verifica se o token JWT está no localStorage
    const token = localStorage.getItem("jwt");
    if (token) {
      // Se existir um token, define autenticação como verdadeira
      setIsAuthenticated(true);
    } else {
      // Se não houver token, define como falso
      setIsAuthenticated(false);
    }
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
      {/* Exibe Header e Sidebar apenas se o usuário estiver autenticado e não estiver na página de login */}
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
              isAuthenticated ? (
                <div className="homepage">
                  <h1>Sisegg</h1>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Outras rotas protegidas */}
          <Route
            path="/clientecad"
            element={
              isAuthenticated ? <ClienteCad /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/corretoracad"
            element={
              isAuthenticated ? <CorretorCad /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/usuariocad"
            element={
              isAuthenticated ? <UsuarioCad /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/seguradoracad"
            element={
              isAuthenticated ? <SeguradoraCad /> : <Navigate to="/login" />
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
