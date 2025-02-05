import React, { useState, useEffect } from 'react';
import './ProdutorList.css';
import { toast } from 'react-toastify';

export const ProdutorList = ({ vetor, selecionar, closeModal }) => {
  const [idPesquisa, setIdPesquisa] = useState('');
  const [nomePesquisa, setNomePesquisa] = useState('');
  const [cpfPesquisa, setCpfPesquisa] = useState('');
  const [cnpjPesquisa, setCnpjPesquisa] = useState('');

  const [produtores, setProdutores] = useState([]);

  useEffect(() => {
    setProdutores(vetor);
  }, [vetor]);

  const handlePesquisa = () => {
    let query = '?';
    if (idPesquisa) query += `id=${idPesquisa}&`;
    if (nomePesquisa) query += `nome=${nomePesquisa}&`;
    if (cpfPesquisa) query += `cpf=${cpfPesquisa}&`;
    if (cnpjPesquisa) query += `cnpj=${cnpjPesquisa}&`;

    fetch(`http://localhost:8080/produtor/search${query}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          toast.error(errorMessage || 'Erro ao pesquisar produtores');
          setProdutores([]);
          return [];
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setProdutores(data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar produtores:', error);
        toast.error('Erro inesperado ao buscar produtores');
      });
  };

  return (
    <div className="produtorListCont">
      <table id="produtorTable">
        <thead>
          {/* Linha de pesquisa */}
          <tr id="pesquisa">
            <th><input type="text" placeholder="ID" value={idPesquisa} onChange={(e) => setIdPesquisa(e.target.value)} /></th>
            <th><input type="text" placeholder="Nome" value={nomePesquisa} onChange={(e) => setNomePesquisa(e.target.value)} /></th>
            <th><input type="text" placeholder="CPF" value={cpfPesquisa} onChange={(e) => setCpfPesquisa(e.target.value)} /></th>
            <th><input type="text" placeholder="CNPJ" value={cnpjPesquisa} onChange={(e) => setCnpjPesquisa(e.target.value)} /></th>
            <th className="botao-centralizado">
              <button onClick={handlePesquisa}>Pesquisar</button>
            </th>
            <th id="close">
              <button onClick={closeModal} id="x">Fechar</button>
            </th>
          </tr>

          {/* Cabeçalhos da tabela */}
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>CNPJ</th>
            <th className="titulo-centralizado">E-mail</th>
            <th className="titulo-centralizado">Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {produtores.length > 0 ? (
            produtores.map((produtor) => (
              <tr key={produtor.id}>
                <td>{produtor.id}</td>
                <td>{produtor.nome}</td>
                <td>{produtor.cpf || '-'}</td>
                <td>{produtor.cnpj || '-'}</td>
                <td>{produtor.email || '-'}</td>
                <td className="botao-selecionar">
                  <button onClick={() => selecionar(produtor.id)}>Selecionar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nenhum produtor encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutorList;
