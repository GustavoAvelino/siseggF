import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa"; // Importa o ícone de visualização
import "./PropostaApoliceListPage.css"; // Certifique-se de que esse CSS esteja atualizado

function PropostaApoliceListPage() {
  const navigate = useNavigate();

  // Campo de busca (texto)
  const [searchTerm, setSearchTerm] = useState("");
  // Combobox de status
  const [statusFilter, setStatusFilter] = useState("");
  // Lista de propostas
  const [propostas, setPropostas] = useState([]);

  // Ao alterar o status, dispara a pesquisa
  useEffect(() => {
    handleSearch();
  }, [statusFilter]);

  const handleSearch = () => {
    let url = "http://82.29.59.62:9090/proposta-apolice";
    const params = [];

    if (searchTerm) {
      params.push(`nrProposta=${encodeURIComponent(searchTerm)}`);
    }

    // Se um status específico for selecionado, usa o endpoint de busca
    if (statusFilter && statusFilter !== "TODOS") {
      url += "/buscar";
      params.push(`status=${encodeURIComponent(statusFilter)}`);
    } else {
      url += "/ativas";
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log("🔎 Buscando propostas em:", url);

    fetch(url)
      .then(async (response) => {
        const text = await response.text();
        console.log("📌 Resposta bruta da API:", text);
        if (!response.ok) {
          throw new Error(text || "Erro ao buscar Propostas/Apolices.");
        }
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("📌 Propostas encontradas:", data);
        setPropostas(data);
      })
      .catch((error) => {
        console.error("❌ Erro ao buscar propostas:", error);
        toast.error(error.message);
        setPropostas([]);
      });
  };

  // Determina qual número de documento exibir: Endosso > Apólice > Proposta
  const getNumeroDocumento = (proposta) => {
    if (proposta.nrEndosso) {
      return proposta.nrEndosso;
    } else if (proposta.nrApolice) {
      return proposta.nrApolice;
    } else {
      return proposta.nrProposta;
    }
  };

  // Determina o tipo de documento com base no número apresentado
  const getTipoDocumento = (proposta) => {
    if (proposta.nrEndosso) {
      return "Endosso";
    } else if (proposta.nrApolice) {
      return "Apólice";
    } else {
      return "Proposta";
    }
  };

  return (
    <div className="proposta-apolice-container">
      <h1 className="proposta-apolice-title">Propostas e Apólices</h1>
      <div className="proposta-apolice-filters">
        <div className="proposta-apolice-status-box">
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos (exceto Canceladas e Recusadas)</option>
            <option value="Vigente">Vigente</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Recusada">Recusada</option>
            <option value="Endossada">Endossada</option>
          </select>
        </div>
        <div className="proposta-apolice-buttons">
          <input
            type="text"
            placeholder="Digite Nº do Documento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="proposta-apolice-search-input"
          />
          <button
            onClick={handleSearch}
            className="proposta-apolice-search-btn"
          >
            Pesquisar
          </button>
          <button
            onClick={() => navigate("/proposta-apolice/novo")}
            className="proposta-apolice-novo-btn"
          >
            Novo
          </button>
          <button
            onClick={() => navigate("/importar")}
            className="proposta-apolice-importar-btn"
          >
            Importar
          </button>
        </div>
      </div>
      <table className="proposta-apolice-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Nº Documento</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {propostas.length > 0 ? (
            propostas.map((proposta) => (
              <tr key={proposta.id}>
                <td>{proposta.clienteNome || "Não informado"}</td>
                <td>{getNumeroDocumento(proposta)}</td>
                <td>{getTipoDocumento(proposta)}</td>
                <td>{proposta.status}</td>
                <td>
                  <button
                    className="proposta-apolice-ver-editar-btn"
                    onClick={() =>
                      navigate(`/proposta-apolice/detalhes/${proposta.id}`)
                    }
                  >
                    <FaEye size={18} style={{ marginRight: "8px" }} />
                    Ver/Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                Nenhuma Proposta/Apolice encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PropostaApoliceListPage;
