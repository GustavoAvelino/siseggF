import React, { useState, useEffect } from 'react';
import './UsuarioCadForm.css';

export const UsuarioCadForm = ({ eventoTeclado, salvar, obj, openModal, atualizar, excluir }) => {

  const [role, setRole] = useState(obj.role || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Envio de formulário de usuário.");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1]?.focus();
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = parseInt(event.target.value, 10);
    setRole(selectedRole);
    eventoTeclado(event);
  };

  useEffect(() => {
    setRole(obj.role || "");
  }, [obj.role]);

  return (
    <div className="container-usuario">
      <div className="botoes-usuario">
        <button onClick={salvar}>Salvar</button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>
      <h1 id='title-usuario'>Usuário</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo: Nome Completo */}
        <div className="input-field-usuario">
          <label htmlFor="nomeCom">Nome Completo:</label><br />
          <input
            type="text"
            id="nomeUsuario"
            name="nomeCom"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.nomeCom}
            required
          />
        </div>

        {/* Campo: Email */}
        <div className="input-field-usuario">
          <label htmlFor="emailUsuario">Email:</label><br />
          <input
            type="email"
            id="emailUsuario"
            name="email"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.email}
            required
          />
        </div>

        {/* Campo: Senha */}
        <div className="input-field-usuario">
          <label htmlFor="senhaUsuario">Senha:</label><br />
          <input
            type="password"
            id="senhaUsuario"
            name="senha"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.senha}
            required
          />
        </div>

        {/* Campo: Confirmar Senha */}
        <div className="input-field-usuario">
          <label htmlFor="confSenhaUsuario">Confirmar Senha:</label><br />
          <input
            type="password"
            id="confSenhaUsuario"
            name="confSenha"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.confSenha}
            required
          />
        </div>

        {/* Campo: Nível de Autoridade */}
        <div className="input-field-usuario">
          <label htmlFor="roleUsuario">Nível de Autoridade:</label><br />
          <select
            id="roleUsuario"
            name="role"
            onKeyDown={handleKeyDown}
            onChange={handleRoleChange}
            value={role}
            required
          >
            <option value="">Selecione</option>
            <option value="1">Administrador</option>
            <option value="2">Vendedor</option>
            <option value="3">Financeiro</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default UsuarioCadForm;
