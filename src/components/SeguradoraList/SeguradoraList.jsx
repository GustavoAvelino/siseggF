import React, { useState, useEffect } from 'react';
import './SeguradoraList.css';

export const SeguradoraList = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [cnpjPesquisa, setCnpjPesquisa] = useState('');
  const [seguradoras, setSeguradoras] = useState([]);

  useEffect(() => {
    setSeguradoras(vetor);
  }, [vetor]);

  // Função para pesquisa
  const handlePesquisa = () => {
    // Pega a corretora do usuário logado
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    let query = '?';

    if (idPesquisa) {
      query += `id=${idPesquisa}&`;
    } else if (cnpjPesquisa) {
      query += `cnpj=${cnpjPesquisa}&`;
    } else if (nomePesquisa) {
      query += `descricao=${nomePesquisa}&`;
    }

    // Sempre filtra pela corretora
    query += `corretoraId=${userCorretoraId}`;

    fetch(`http://82.29.59.62:9090/seguradora/search${query}`)
      .then((response) => {
        if (!response.ok) {
          // se vier 404, retorna lista vazia
          setSeguradoras([]);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        setSeguradoras(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar seguradoras:', error);
      });
  };

  return (
    <div className="seguradoraListCont">
      <table id="seguradoraTable">
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
                placeholder="CNPJ"
                value={cnpjPesquisa}
                onChange={(e) => setCnpjPesquisa(e.target.value)}
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
            <th>CNPJ</th>
            <th>Nome</th>
            <th>Nome Fantasia</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {seguradoras && seguradoras.length > 0 ? (
            seguradoras.map((seguradora) => (
              <tr key={seguradora.id}>
                <td>{seguradora.id}</td>
                <td>{seguradora.cnpj}</td>
                <td>{seguradora.nome}</td>
                <td>{seguradora.nomefan}</td>
                <td>
                  <button onClick={() => selecionar(seguradora.id)}>Selecionar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhuma seguradora encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SeguradoraList;
