import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import "./header.css";

export const Header = () => {
  const [username, setUsername] = useState("Usuário"); // Nome do usuário logado
  const [menuVisible, setMenuVisible] = useState(false); // Controle de visibilidade do menu

  useEffect(() => {
    // Puxa o nome do usuário logado do localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Remove o token JWT e o nome do usuário do localStorage
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");

    // Redireciona para a página de login
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <nav>
      <div className="navbar">
        <div className="user-section" onClick={toggleMenu}>
          <FaRegUserCircle className="icon" />
          <p>{username}</p>
        </div>
        {menuVisible && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
