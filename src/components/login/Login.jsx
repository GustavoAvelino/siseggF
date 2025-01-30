import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/usuario/login", {
        email: username,
        senha: password,
      });

      // Extrai token, nomeCom e corretoraId
      console.log("Dados do login:", response.data); // DEBUG
      const { token, nomeCom, corretoraId } = response.data;
      console.log("corretoraId:", corretoraId); // DEBUG

      // Armazena no localStorage
      localStorage.setItem("jwt", token);
      localStorage.setItem("username", nomeCom);
      localStorage.setItem("corretoraId", corretoraId || "");

      // Redireciona
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos. Tente novamente.");
    }
  };

  const showPass = () => {
    const senha = document.getElementById("senha");
    if (senha.type === "password") {
      senha.setAttribute("type", "text");
    } else {
      senha.setAttribute("type", "password");
    }
  };

  return (
    <div className="container-login">
      <form onSubmit={handleSubmit}>
        <h1>Entrar no Sisegg</h1>
        {error && <p className="error">{error}</p>}
        <div className="input-field">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
          <FaEye className="eye" id="eye" onClick={showPass} />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
