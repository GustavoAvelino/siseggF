import React, { useState, useEffect } from "react";
import "./ContasAReceberListModal.css";
import { toast } from "react-toastify";

const ContasAReceberListModal = ({ vetor, selecionar, closeModal }) => {
  const [produtorPesquisa, setProdutorPesquisa] = useState("");
  const [documentoPesquisa, setDocumentoPesquisa] = useState("");
  const [dataPesquisa, setDataPesquisa] = useState("");
  const [statusPesquisa, setStatusPesquisa] = useState("");
  const [contas, setContas] = useState([]);

  useEffect(() => {
    setContas(vetor);
  }, [vetor]);

  // Função para converter data do formato dd/MM/yyyy para Date para ordenar
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dateStr);
  };

  const handlePesquisa = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    let query = `?corretoraId=${corretoraId}&`;
    if (produtorPesquisa) {
      query += `produtor=${produtorPesquisa}&`;
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
    
    fetch(`http://82.29.59.62:9090/parc-comissao-doc/search${query}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          toast.error(errorMessage || "Erro ao pesquisar contas a Receber");
          setContas([]);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          data.sort((a, b) => parseDate(b.dataVencimento) - parseDate(a.dataVencimento));
          setContas(data);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar contas:", error);
        toast.error("Erro inesperado ao buscar contas a Receber");
      });
  };

  return (
    <div className="contasListCont">
      <table id="contasTable">
        <thead>
          <tr id="contasPesquisa">
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
                placeholder="Produtor"
                value={produtorPesquisa}
                onChange={(e) => setProdutorPesquisa(e.target.value)}
              />
            </th>
            <th>
              <select
                className="comboboxCR"
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
            <th id="closeBtn">
              <button onClick={closeModal} id="x">
                Fechar
              </button>
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Documento</th>
            <th>Produtor</th>
            <th>Tipo</th>
            <th>Data de Vencimento</th>
            <th>Status</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {contas && contas.length > 0 ? (
            contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.id}</td>
                <td>{conta.numeroDocumento || "-"}</td>
                <td>{conta.produtor || "-"}</td>
                <td>{conta.tipoDocumento || "-"}</td>
                <td>{conta.dataVencimento || "-"}</td>
                <td>{conta.recebido ? "Pago" : "Pendente"}</td>
                <td>
                  <button id="selectContaBtn" onClick={() => selecionar(conta.id)}>
                    Selecionar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhuma conta encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContasAReceberListModal;
