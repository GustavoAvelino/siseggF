import React, { useState } from 'react';
import './VeiculoList.css';

export const VeiculoListTable = ({ vetor, selecionar, closeModal, clienteId }) => {
  const [placaPesquisa, setPlacaPesquisa] = useState('');
  const [modeloPesquisa, setModeloPesquisa] = useState('');
  const [veiculos, setVeiculos] = useState(vetor);

  // Observe que NÃO temos mais clienteIdPesquisa no state,
  // pois queremos travar a pesquisa no clienteId do pai.

  const handlePesquisa = () => {
    // Montamos a query SEMPRE com o clienteId recebido por props
    let query = `?clienteId=${clienteId}`;
    
    if (placaPesquisa) {
      query += `&placa=${placaPesquisa}`;
    }
    if (modeloPesquisa) {
      query += `&modelo=${modeloPesquisa}`;
    }

    fetch(`http://localhost:8080/veiculo/search${query}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar veículos');
        }
        return response.json();
      })
      .then(data => {
        setVeiculos(data);
      })
      .catch(error => {
        console.error('Erro ao buscar veículos:', error);
      });
  };

  return (
    <div className="veiculoListCont">
      <table id="veiculoTable">
        <thead>
          <tr id="pesquisa">
            <th>
              <div className="pesquisacom input-field">
                <input
                  type="text"
                  placeholder="Placa"
                  value={placaPesquisa}
                  onChange={(e) => setPlacaPesquisa(e.target.value)}
                />
              </div>
            </th>
            <th>
              <div className="pesquisacomdesc input-field">
                <input
                  type="text"
                  placeholder="Modelo"
                  value={modeloPesquisa}
                  onChange={(e) => setModeloPesquisa(e.target.value)}
                />
              </div>
            </th>
            {/* REMOVIDO o campo de clienteIdPesquisa */}
            
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
            <th>Placa</th>
            <th>Modelo</th>
            <th>Ano Modelo</th>
            <th>Ano Fabricação</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {veiculos && veiculos.length > 0 ? (
            veiculos.map((veiculo) => (
              <tr key={veiculo.id}>
                <td>{veiculo.placa}</td>
                <td>{veiculo.modelo}</td>
                <td>{veiculo.anoModelo}</td>
                <td>{veiculo.anoFabricacao}</td>
                <td>
                  <button onClick={() => selecionar(veiculo.id)}>
                    Selecionar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum veículo encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VeiculoListTable;
