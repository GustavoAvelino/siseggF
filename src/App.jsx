import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes e páginas
import Login from "./components/login/Login";
import Sidebar from "./components/Sidebar/sidebar";
import Header from "./components/Header/header";
import ClienteCad from "./pages/clienteCad/CliCad";
import CorretorCad from "./pages/corretoraCad/correcad";
import UsuarioCad from "./pages/usuarioCad/usuariocad";
import SeguradoraCad from "./pages/SeguradoraCad/SeguradoraCad";
import GradeComissaoCad from "./pages/GradeComissaoCad/GradeComissaoCad";
import ProdutorCad from "./pages/ProdutorCad/ProdutorCad";

// Propostas / Apólices
import PropostaApoliceListPage from "./components/PropostaApoliceList/PropostaApoliceListPage";
import PropostaApoliceCadPage from "./pages/PropostaApoliceCadPage/PropostaApoliceCadPage";
import PropostaApoliceDetalhesPage from "./pages/PropostaApoliceDetalhesPage/PropostaApoliceDetalhesPage";

// PDF Importação / Associação
import ImportacaoPage from "./pages/ImportacaoPage/ImportacaoPage";
import AssociacaoPage from "./pages/AssociacaoPage/AssociacaoPage";

import ContasAReceberPage from "./pages/ContasAReceberPage/ContasAReceberPage";
import BaixaParcelaPage from "./pages/BaixaParcelaPage/BaixaParcelaPage"; // NOVO
import RelatorioComissaoProdutorWrapper from "./pages/RelatorioComissaoProdutorPage/RelatorioComissaoProdutorPage";
import MulticalculoListPage from "./pages/MulticalculoListPage/MulticalculoListPage";
import MulticalculoCadPage from "./pages/MulticalculoCadPage/MulticalculoCadPage";

// Rota protegida
import ProtectedRoute from "./utils/ProtectedRoute";

import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Atualiza o estado de autenticação com base na presença do token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("corretoraId");
    localStorage.removeItem("produtorId");

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

      <div
        className={
          isAuthenticated && location.pathname !== "/login"
            ? "main-content"
            : ""
        }
      >
        <Routes>
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />

          {/* Home protegida */}
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

          {/* Cadastros básicos */}
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
          <Route
            path="/produtorcad"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProdutorCad />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gradecomissao"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GradeComissaoCad />
              </ProtectedRoute>
            }
          />

          {/* Importar PDF e Associação */}
          <Route
            path="/importar"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ImportacaoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/associar"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AssociacaoPage />
              </ProtectedRoute>
            }
          />

          {/* Propostas e Apólices */}
          <Route
            path="/proposta-apolice"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PropostaApoliceListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposta-apolice/novo"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PropostaApoliceCadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposta-apolice/editar/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PropostaApoliceCadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposta-apolice/detalhes/:propostaId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PropostaApoliceDetalhesPage />
              </ProtectedRoute>
            }
          />

          {/* Contas a Receber */}
          <Route
            path="/contas-a-receber"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ContasAReceberPage />
              </ProtectedRoute>
            }
          />

          {/* NOVA ROTA: Contas a Pagar */}
          <Route
            path="/baixa-Parcelas"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BaixaParcelaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/relatorio-comissao-produtor"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RelatorioComissaoProdutorWrapper />
              </ProtectedRoute>
            }
          />


          {/* Rotas de Multicalculo */}
          <Route
            path="/multicalculo-list"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MulticalculoListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/multicalculo/novo"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MulticalculoCadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/multicalculo/editar/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MulticalculoCadPage />
              </ProtectedRoute>
            }
          />

          {/* Se nenhuma rota match, redireciona para / */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
