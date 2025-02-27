import React, { useState, useEffect } from 'react';
import './ClienteList.css'; // Ajuste se o nome do seu CSS for diferente
import { toast } from 'react-toastify';

// Recebe o array inicial de clientes (vetor), função selecionar(id) e closeModal()
export const ClienteList = ({ vetor, selecionar, closeModal }) => {
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
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    let query = '?';
    if (idPesquisa) {
      query += `id=${idPesquisa}&`;
    } else if (cnpjCpfPesquisa) {
      query += `cnpjCpf=${cnpjCpfPesquisa}&`;
    } else if (nomePesquisa) {
      query += `descricao=${nomePesquisa}&`;
    }
    query += `corretoraId=${userCorretoraId}`;

    fetch(`http://82.29.59.62:9090/cliente/search${query}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          toast.error(errorMessage || 'Erro ao pesquisar clientes');
          setClientes([]);
          return [];
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setClientes(data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Erro inesperado ao buscar clientes');
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

export default ClienteList;
