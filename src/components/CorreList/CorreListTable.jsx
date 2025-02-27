import React, { useState } from 'react';
import './COrreList.css';

export const CorreListTable = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [descricaoPesquisa, setDescricaoPesquisa] = useState('');
  const [cnpjPesquisa, setCnpjPesquisa] = useState('');
  const [corretoras, setCorretoras] = useState(vetor);

  const handlePesquisa = () => {
    let query = '';

    if (idPesquisa) {
      query = `?id=${idPesquisa}`;
    } else if (descricaoPesquisa) {
      query = `?descricao=${descricaoPesquisa}`;
    } else if (cnpjPesquisa) {
      query = `?cnpj=${cnpjPesquisa}`;
    }

    if (query) {
      fetch(`http://82.29.59.62:9090/corretora/search${query}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Nenhuma corretora encontrada.');
        })
        .then((data) => setCorretoras(data))
        .catch((error) => {
          console.error('Erro ao buscar corretoras:', error);
          setCorretoras([]); // Limpa a tabela se nenhum resultado for encontrado
        });
    }
  };

  return (
    <div className="correListCont">
      <table id="correTable">
        <thead>
          <tr id="pesquisa">
            <th>
              <input
                type="text"
                id="pesquisaId"
                placeholder="ID"
                value={idPesquisa}
                onChange={(e) => setIdPesquisa(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                id="pesquisaDescricao"
                placeholder="Nome"
                value={descricaoPesquisa}
                onChange={(e) => setDescricaoPesquisa(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                id="pesquisaCnpj"
                placeholder="CNPJ"
                value={cnpjPesquisa}
                onChange={(e) => setCnpjPesquisa(e.target.value)}
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
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Susep</th>
            <th>Endereço</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {corretoras.length > 0 ? (
            corretoras.map((obj) => (
              <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.nome}</td>
                <td>{obj.cnpj}</td>
                <td>{obj.susep}</td>
                <td>{obj.endereco}</td>
                <td>
                  <button onClick={() => selecionar(obj.id)}>Selecionar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Nenhuma corretora encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CorreListTable;
