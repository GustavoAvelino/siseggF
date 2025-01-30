import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    return <Navigate to="/login" />;
  }

  // Se estiver autenticado, renderize o conteúdo da rota protegida
  return children;
};

export default ProtectedRoute;
