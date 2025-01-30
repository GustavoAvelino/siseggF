import React, { useState, useEffect } from 'react';
import './ClienteList.css'; // Ajuste se o nome do seu CSS for diferente

// Recebe o array inicial de clientes (vetor), função selecionar(id) e closeModal()
export const ClienteListTable = ({ vetor, selecionar, closeModal }) => {
  // Estados de pesquisa
  const [idPesquisa, setIdPesquisa] = useState('');
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [cnpjCpfPesquisa, setCnpjCpfPesquisa] = useState('');

  // Estado interno para exibir a lista de clientes
  const [clientes, setClientes] = useState([]);

  // Ao montar ou quando "vetor" mudar, atualiza "clientes"
  useEffect(() => {
    setClientes(vetor);
  }, [vetor]);

  // Função para pesquisa refinada
  const handlePesquisa = () => {
    // Pega a corretora do usuário logado
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    // Monta a query
    // começamos com '?', e adicionamos cada parâmetro se preenchido
    let query = '?';

    if (idPesquisa) {
      query += `id=${idPesquisa}&`;
    } else if (cnpjCpfPesquisa) {
      query += `cnpjCpf=${cnpjCpfPesquisa}&`;
    } else if (nomePesquisa) {
      query += `descricao=${nomePesquisa}&`;
    }

    // Sempre filtra pela corretora do usuário
    query += `corretoraId=${userCorretoraId}`;

    // Exemplo final: /cliente/search?id=10&corretoraId=5, ou /cliente/search?cnpjCpf=1234&corretoraId=5
    fetch(`http://localhost:8080/cliente/search${query}`)
      .then(response => {
        if (!response.ok) {
          // Se vier 404 (NOT_FOUND), zera a lista
          setClientes([]);
          return [];
        }
        return response.json();
      })
      .then(data => {
        setClientes(data);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  };

  return (
    <div className="clienteListCont">
      <table id="clienteTable">
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
                placeholder="CNPJ/CPF"
                value={cnpjCpfPesquisa}
                onChange={(e) => setCnpjCpfPesquisa(e.target.value)}
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
              <button onClick={handlePesquisa}>Pesquisar</button>
            </th>
            <th id="close">
              <button onClick={closeModal} id="x">Fechar</button>
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>CNPJ/CPF</th>
            <th>Nome</th>
            <th>Nome Social</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {clientes && clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.cnpjCpf}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.nomeSocial}</td>
                <td id="SelectCli">
                  <button onClick={() => selecionar(cliente.id)}>
                    Selecionar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum cliente encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteListTable;
