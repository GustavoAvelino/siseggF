import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import "./MulticalculoListPage.css";

function MulticalculoListPage() {
  const navigate = useNavigate();
  const [multicalculos, setMulticalculos] = useState([]);
  const [tipoSeguroFilter, setTipoSeguroFilter] = useState("");

  useEffect(() => {
    handleSearch();
  }, [tipoSeguroFilter]);

  const handleSearch = () => {
    const corretoraId = localStorage.getItem("corretoraId") || "";
    let url = `http://82.29.59.62:9090/multicalculo?corretoraId=${corretoraId}`;
    if (tipoSeguroFilter) {
      url += `&tipoSeguro=${encodeURIComponent(tipoSeguroFilter)}`;
    }
    fetch(url)
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || "Erro ao buscar Multicalculos.");
        }
        return JSON.parse(text);
      })
      .then((data) => {
        setMulticalculos(data);
      })
      .catch((error) => {
        toast.error(error.message);
        setMulticalculos([]);
      });
  };

  const handleGerarPdf = (id) => {
    window.open(`http://82.29.59.62:9090/multicalculo/gerar-pdf/${id}`, "_blank");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este Multicálculo?")) {
      try {
        const res = await fetch(`http://82.29.59.62:9090/multicalculo/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Erro ao excluir Multicálculo");
        }
        toast.success("Multicálculo excluído com sucesso!");
        handleSearch();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const tipoSeguroOpcoes = ["NOVO", "RENOVACAO_INTERNA", "RENOVACAO_EXTERNA"];

  return (
    <div className="multicalculo-list-container">
      <h1 className="tittleMC">Listagem de Multicálculos</h1>

      <div className="multicalculo-list-filters">
        <div className="multicalculo-list-filter">
          <label>Tipo de Seguro:</label>
          <select
            value={tipoSeguroFilter}
            onChange={(e) => setTipoSeguroFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {tipoSeguroOpcoes.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate("/multicalculo/novo")}
          className="multicalculo-list-novo-btn"
        >
          Novo Multicálculo
        </button>
      </div>

      <table className="multicalculo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Tipo de Seguro</th>
            <th>Vigência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {multicalculos.length > 0 ? (
            multicalculos.map((mc) => (
              <tr key={mc.id}>
                <td>{mc.id}</td>
                <td>{mc.cliente ? mc.cliente.nome : "Não informado"}</td>
                <td>{mc.tipoSeguro}</td>
                <td>
                  {mc.vigenciaInicio} até {mc.vigenciaFim}
                </td>
                <td>
                  <button
                    className="action-btn pdf-btn"
                    onClick={() => handleGerarPdf(mc.id)}
                    title="Gerar PDF"
                  >
                    <FaFileAlt size={18} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(mc.id)}
                    title="Excluir"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nenhum Multicálculo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MulticalculoListPage;
