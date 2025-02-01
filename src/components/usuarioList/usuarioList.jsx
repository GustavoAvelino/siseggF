import React, { useState, useEffect } from 'react';
import style from './usuarioList.css'; // Ajuste o caminho se necessário

export const UsuarioListTable = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [usuarios, setUsuarios] = useState(vetor);

  // Atualiza a lista de usuários quando 'vetor' mudar
  useEffect(() => {
    setUsuarios(vetor);
  }, [vetor]);

  // Função para pesquisa refinada
  const handlePesquisa = () => {
    // Pega a corretora do usuário logado
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    // Monta a query
    let query = '?';

    if (idPesquisa) {
      query += `id=${idPesquisa}&`;
    } else if (nomePesquisa) {
      query += `nomeCom=${nomePesquisa}&`;
    }

    // Sempre filtra pela corretora
    query += `corretoraId=${userCorretoraId}`;

    // Exemplo final de URL: /usuario/search?id=3&corretoraId=10
    // ou /usuario/search?nomeCom=joao&corretoraId=10
    fetch(`http://localhost:8080/usuario/search${query}`)
      .then(response => {
        if (!response.ok) {
          // se vier 404 (NOT_FOUND), zera a lista
          setUsuarios([]);
          return [];
        }
        return response.json();
      })
      .then(data => {
        setUsuarios(data);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
      });
  };

  return (
    <div className="usuarioListCont">
      <table id="usuarioTable">
        <thead>
          <tr id="pesquisa">
            <th>
              <input
                type="text"
                placeholder="ID"
                value={idPesquisa}
                onChange={(e) => setIdPesquisa(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Nome"
                value={nomePesquisa}
                onChange={(e) => setNomePesquisa(e.target.value)}
              />
            </th>
            <th>
               
            </th>
            <th>
              <button onClick={handlePesquisa}>Pesquisar</button>  
            </th>
            <th>
            <button onClick={closeModal}>Fechar</button>
            </th>
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
          {usuarios && usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nomeCom}</td>
                <td>{usuario.email}</td>
                <td>
                  {usuario.role === 1
                    ? 'Administrador'
                    : usuario.role === 2
                    ? 'Vendedor'
                    : 'Financeiro'}
                </td>
                <td>
                  <button onClick={() => selecionar(usuario.id)}>
                    Selecionar
                  </button>
                </td>
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
