import React, { useState } from 'react';
import style from '../usuarioList/usuarioList.css';  // Certifique-se de criar o arquivo CSS para este componente.

export const UsuarioListTable = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [emailPesquisa, setEmailPesquisa] = useState('');
  const [usuarios, setUsuarios] = useState(vetor);  // Estado para armazenar os usuários

  // Função para pesquisa
  const handlePesquisa = () => {
    let query = '';
    if (idPesquisa) {
      query = `?id=${idPesquisa}`;
    } else if (emailPesquisa) {
      query = `?email=${emailPesquisa}`;
    }

    if (query) {
      fetch(`http://localhost:8080/usuario/search${query}`)
        .then(response => response.json())
        .then(data => {
          setUsuarios(data);  // Atualiza a lista com os usuários encontrados
        })
        .catch(error => {
          console.error("Erro ao buscar usuários:", error);
        });
    }
  };

  return (
    <div className="usuarioListCont">
      <table id="usuarioTable">
        <thead>
          <tr id="pesquisa">
            <th>
              <div className="pesquisacom input-field">
                <input 
                  type="text" 
                  id="pesquisacom" 
                  name="pesquisacom" 
                  placeholder="ID" 
                  value={idPesquisa}
                  onChange={(e) => setIdPesquisa(e.target.value)}
                />
              </div>
            </th>
            <th>
              <div className="pesquisacomdesc input-field">
                <input 
                  type="text" 
                  id="pesquisacomdesc" 
                  name="pesquisacomdesc" 
                  placeholder="Email" 
                  value={emailPesquisa}
                  onChange={(e) => setEmailPesquisa(e.target.value)}
                />
              </div>
            </th>
            <th><button onClick={handlePesquisa}>Pesquisar</button></th>
            <th></th>
            <th><button onClick={closeModal}>Fechar</button></th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Nome Completo</th>
            <th>Email</th>
            <th>Role</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nomeCom}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role === 1 ? 'Administrador' : usuario.role === 2 ? 'Vendedor' : 'Financeiro'}</td>
                <td><button onClick={() => selecionar(usuario.id)}>Selecionar</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum usuário encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuarioListTable;
