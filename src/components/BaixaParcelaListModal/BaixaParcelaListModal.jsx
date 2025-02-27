import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./BaixaParcelaListModal.css";

const BaixaParcelaListModal = ({ vetor, selecionar, closeModal }) => {
  const [seguradoPesquisa, setSeguradoPesquisa] = useState("");
  const [documentoPesquisa, setDocumentoPesquisa] = useState("");
  const [dataPesquisa, setDataPesquisa] = useState("");
  const [statusPesquisa, setStatusPesquisa] = useState("");
  const [contas, setContas] = useState([]);

  useEffect(() => {
    setContas(vetor);
  }, [vetor]);

  const handlePesquisa = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    if (!corretoraId) {
      toast.warning("Corretora não identificada.");
      return;
    }
    let query = `?corretoraId=${corretoraId}&`;
    if (seguradoPesquisa) {
      query += `segurado=${seguradoPesquisa}&`;
    }
    if (documentoPesquisa) {
      query += `documento=${documentoPesquisa}&`;
    }
    if (dataPesquisa) {
      query += `data=${dataPesquisa}&`;
    }
    if (statusPesquisa && statusPesquisa !== "Todos") {
      query += `status=${statusPesquisa}&`;
    }
    if (query.endsWith("&")) {
      query = query.slice(0, -1);
    }

    fetch(`http://82.29.59.62:9090/parcela-pagamento/search${query}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          toast.error(errorMessage || "Erro ao pesquisar parcelas");
          setContas([]);
          return;
        }
        const data = await response.json();
        setContas(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar contas:", error);
        toast.error("Erro inesperado ao buscar parcelas");
      });
  };

  // Função para converter data do formato dd/MM/yyyy para Date para ordenar
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dateStr);
  };

  return (
    <div className="BaixaParcelaListModal">
      <table className="BaixaParcelaTable">
        <thead>
          <tr className="BaixaParcelaPesquisa">
            <th>
              <input
                type="date"
                placeholder="Data"
                value={dataPesquisa}
                onChange={(e) => setDataPesquisa(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Documento"
                value={documentoPesquisa}
                onChange={(e) => setDocumentoPesquisa(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Segurado"
                value={seguradoPesquisa}
                onChange={(e) => setSeguradoPesquisa(e.target.value)}
              />
            </th>
            <th>
              <select
                className="comboboxCP"
                value={statusPesquisa}
                onChange={(e) => setStatusPesquisa(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
              </select>
            </th>
            <th></th>
            <th>
              <button onClick={handlePesquisa}>Pesquisar</button>
            </th>
            <th>
              <button onClick={closeModal} id="x">
                Fechar
              </button>
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Documento</th>
            <th>Segurado</th>
            <th>Tipo</th>
            <th>Data de Vencimento</th>
            <th>Status</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {contas && contas.length > 0 ? (
            contas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.numeroDocumento || "-"}</td>
                <td>{c.segurado || "-"}</td>
                <td>{c.tipoDocumento || "-"}</td>
                <td>{c.dataVencimento || "-"}</td>
                <td>{c.pago ? "Pago" : "Pendente"}</td>
                <td>
                  <button onClick={() => selecionar(c.id)}>Selecionar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhuma parcela encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaixaParcelaListModal;
