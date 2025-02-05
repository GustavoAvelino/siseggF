import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/login/Login";
import Sidebar from "./components/Sidebar/sidebar";
import Header from "./components/Header/header";
import ClienteCad from "./pages/clienteCad/CliCad";
import CorretorCad from "./pages/corretoraCad/correcad";
import UsuarioCad from "./pages/usuarioCad/usuariocad";
import SeguradoraCad from "./pages/SeguradoraCad/SeguradoraCad";
import GradeComissaoCad from "./pages/GradeComissaoCad/GradeComissaoCad"; // Nova página adicionada
import ProdutorCad from "./pages/ProdutorCad/ProdutorCad"; // Import ProdutorCad component

import ProtectedRoute from "./utils/ProtectedRoute"; 

import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("corretoraId");

    toast.info("Você foi desconectado com sucesso!");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <div className="App">
      <ToastContainer />

      {isAuthenticated && location.pathname !== "/login" && (
        <>
          <Sidebar />
          <Header handleLogout={handleLogout} />
        </>
      )}

      <div className={isAuthenticated && location.pathname !== "/login" ? "main-content" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><div className="homepage"><h1>Sisegg</h1></div></ProtectedRoute>} />

          <Route path="/clientecad" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ClienteCad /></ProtectedRoute>} />
          <Route path="/corretoracad" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CorretorCad /></ProtectedRoute>} />
          <Route path="/usuariocad" element={<ProtectedRoute isAuthenticated={isAuthenticated}><UsuarioCad /></ProtectedRoute>} />
          <Route path="/seguradoracad" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SeguradoraCad /></ProtectedRoute>} />
          <Route path="/produtorcad" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProdutorCad /></ProtectedRoute>} />

          {/* Nova rota para Grade de Comissão */}
          <Route path="/gradecomissao" element={<ProtectedRoute isAuthenticated={isAuthenticated}><GradeComissaoCad /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
