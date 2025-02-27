import React, { useState, useEffect } from "react";
import "./RelatorioComissaoProdutorPage.css";

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  // parts[0]=dia, parts[1]=mês, parts[2]=ano
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const RelatorioComissaoProdutorPage = () => {
  // Estado para a lista de produtores e produtor selecionado
  const [producers, setProducers] = useState([]);
  const [selectedProdutorId, setSelectedProdutorId] = useState("");

  // Estado para os dados do relatório, loading e erro
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Estados para filtros de data (no formato YYYY-MM-DD)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Busca a lista de produtores assim que o componente monta
  useEffect(() => {
    fetch("http://82.29.59.62:9090/produtor")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar produtores");
        }
        return res.json();
      })
      .then((data) => setProducers(data))
      .catch((err) => console.error(err));
  }, []);

  // Busca os dados do relatório sempre que o produtor selecionado for alterado
  useEffect(() => {
    if (!selectedProdutorId) return;

    setLoading(true);
    fetch(`http://82.29.59.62:9090/produtor/relatorio-comissao/${selectedProdutorId}`)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Erro ao buscar relatório");
        }
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => setErro(err.message))
      .finally(() => setLoading(false));
  }, [selectedProdutorId]);

  // Filtra os dados de acordo com as datas informadas, remove itens com comissão igual a 0 
  // e que tenham tipoDocumento igual a "Proposta".
  const filteredData = dados.filter((item) => {
    const itemDate = parseDate(item.dataVencimento);
    let valid = true;
    if (startDate) {
      const start = new Date(startDate);
      valid = valid && itemDate >= start;
    }
    if (endDate) {
      const end = new Date(endDate);
      valid = valid && itemDate <= end;
    }
    return (
      valid &&
      item.comissaoProdutorParcela !== 0 &&
      item.tipoDocumento.toLowerCase() !== "proposta"
    );
  });

  // Calcula o total da comissão do produtor para o período filtrado
  const totalComissao = filteredData.reduce(
    (acc, item) => acc + item.comissaoProdutorParcela,
    0
  );

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="relatorio-comissao-container">
      <h2 className="relatorio-comissao-title">Relatório de Comissão do Produtor</h2>
      
      {/* Filtros */}
      <div className="relatorio-comissao-filters">
        <div className="relatorio-comissao-filter-item">
          <label>Produtor:</label>
          <select
            value={selectedProdutorId}
            onChange={(e) => setSelectedProdutorId(e.target.value)}
          >
            <option value="">Selecione o Produtor</option>
            {producers.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="relatorio-comissao-filter-item">
          <label>Data Inicial:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="relatorio-comissao-filter-item">
          <label>Data Final:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Exibe o total da comissão para o período */}
      <div className="relatorio-comissao-total">
        <h3>Total Comissão Produtor: {totalComissao.toFixed(2)}</h3>
      </div>

      {/* Tabela do Relatório */}
      <table className="relatorio-comissao-table">
        <thead>
          <tr>
            <th>Doc ID</th>
            <th>Nº Documento</th>
            <th>Data Vencimento</th>
            <th>Parcela</th>
            <th>Prêmio Líquido</th>
            <th>Comissão Corretora</th>
            <th>Comissão Produtor</th>
            <th>Forma Repasse</th>
            <th>Tipo Documento</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.docId}>
              <td>{item.docId}</td>
              <td>{item.numeroDocumento}</td>
              <td>{item.dataVencimento}</td>
              <td>{item.numeroParcela}</td>
              <td>{item.premioLiquido}</td>
              <td>{item.somaComissaoCorretora}</td>
              <td>{item.comissaoProdutorParcela}</td>
              <td>{item.formaRepasse}</td>
              <td>{item.tipoDocumento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioComissaoProdutorPage;
