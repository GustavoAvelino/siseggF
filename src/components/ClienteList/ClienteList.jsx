import React, { useState } from 'react';
import style from './ClienteList.css'
export const ClienteListTable = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [cnpjCpfPesquisa, setCnpjCpfPesquisa] = useState('');
  const [clientes, setClientes] = useState(vetor);

  // Função para pesquisa
  const handlePesquisa = () => {
    let query = '';
    if (idPesquisa) {
      query = `?id=${idPesquisa}`;
    } else if (cnpjCpfPesquisa) {
      query = `?cnpjCpf=${cnpjCpfPesquisa}`;
    } else if (nomePesquisa) {
      query = `?descricao=${nomePesquisa}`;
    }

    if (query) {
      fetch(`http://localhost:8080/cliente/search${query}`)
        .then(response => response.json())
        .then(data => {
          setClientes(data);
        })
        .catch(error => {
          console.error("Erro ao buscar clientes:", error);
        });
    }
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
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.cnpjCpf}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.nomeSocial}</td>
                <td id='SelectCli'>
                  <button  onClick={() => selecionar(cliente.id)}>Selecionar</button>
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
