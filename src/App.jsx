// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Importações do Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Seus imports de componentes
import Login from "./components/login/Login";
import Sidebar from "./components/Sidebar/sidebar";
import Header from "./components/Header/header";
import ClienteCad from "./pages/clienteCad/CliCad";
import CorretorCad from "./pages/corretoraCad/correcad";
import UsuarioCad from "./pages/usuarioCad/usuariocad";
import SeguradoraCad from "./pages/SeguradoraCad/SeguradoraCad";
import ProtectedRoute from "./utils/ProtectedRoute"; // Componente que protege rotas

import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  /**
   * useEffect para verificar se há token no localStorage a cada mudança de rota.
   * Caso queira validar esse token no backend, você poderia fazer uma chamada
   * a uma rota de verificação, e se retornasse 200, setIsAuthenticated(true), caso contrário false.
   */
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    // Define como autenticado se houver token (você pode melhorar isso chamando o backend para validação)
    setIsAuthenticated(!!token);
  }, [location]);

  /**
   * Função de logout: remove o token (e quaisquer dados de usuário) e redireciona.
   */
  const handleLogout = () => {
    // Removemos o token do localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");

    // Feedback para o usuário
    toast.info("Você foi desconectado com sucesso!");

    // Atualiza estado
    setIsAuthenticated(false);

    // Redireciona
    window.location.href = "/login";
  };

  return (
    <div className="App">
      {/* Container para exibir notificações (toasts) */}
      <ToastContainer />

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
          {/* Rota de Login (pública) */}
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

          {/* Redirecionamento padrão para a página inicial caso a rota não exista */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
