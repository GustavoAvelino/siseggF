import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CancelRecusaModal from "../../components/CancelRecusaModal/CancelRecusaModal";
import "./PropostaApoliceDetalhesPage.css";

function PropostaApoliceDetalhesPage() {
  const { propostaId } = useParams();
  const navigate = useNavigate();
  const [proposta, setProposta] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [mostrarVeiculos, setMostrarVeiculos] = useState(false);
  const [novoAnexo, setNovoAnexo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState(null); // "cancelar" ou "recusar"

  // Função para formatar datas no padrão dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchPropostaDetalhes();
  }, []);

  const fetchPropostaDetalhes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/${propostaId}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      if (!data) {
        setProposta({});
      } else {
        setProposta(data);
        setVeiculos(data.veiculos || []);
        setPagamentos(data.parcelas || []);
        setComissoes(data.comissoes || []);
        setAnexos(data.anexos || []);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da proposta:", error);
      toast.error("Erro ao carregar os dados da proposta.");
      setProposta({});
    } finally {
      setLoading(false);
    }
  };

  // Ações simples (exemplo: renovar). O "endosso" vamos tratar separadamente
  const handleSimpleAcao = async (acao) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/${propostaId}/${acao}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      toast.success(`Proposta marcada como ${acao.replace("-", " ")}`);
      fetchPropostaDetalhes();
    } catch (error) {
      console.error(`Erro ao marcar proposta como ${acao}:`, error);
      toast.error(`Erro ao marcar como ${acao}`);
    }
  };

  // Função específica para o Endosso
  const handleEndosso = async () => {
    try {
      // Chama o novo endpoint que marca a apólice original como endossada
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/endossar/${propostaId}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      toast.success("Proposta/Apolice marcada como endossada com sucesso!");

      // Agora navega para a tela de NOVO cadastro, passando na URL qual
      // a proposta que está sendo usada como base para o endosso
      navigate(`/proposta-apolice/novo?endossoBase=${propostaId}`);
    } catch (error) {
      console.error("Erro ao marcar proposta como endossada:", error);
      toast.error("Erro ao marcar como endossada");
    }
  };

  // Abre o modal para Cancelar/Recusar
  const handleAcaoComModal = (acao) => {
    setModalAction(acao); // "cancelar" ou "recusar"
  };

  // Envio dos dados do modal para Cancelar
  const submitModalCancelar = async ({ motivo, data }) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/cancelar/${propostaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivoCancelamentoRecusa: motivo, dataCancelamentoRecusa: data }),
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      toast.success("Proposta marcada como Cancelada com sucesso!");
      navigate("/proposta-apolice");
    } catch (error) {
      console.error("Erro ao cancelar proposta:", error);
      toast.error("Erro ao cancelar proposta");
    } finally {
      setModalAction(null);
    }
  };

  // Envio dos dados do modal para Recusar
  const submitModalRecusar = async ({ motivo, data }) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/recusar/${propostaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivoCancelamentoRecusa: motivo, dataCancelamentoRecusa: data }),
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      toast.success("Proposta marcada como Recusada com sucesso!");
      navigate("/proposta-apolice");
    } catch (error) {
      console.error("Erro ao recusar proposta:", error);
      toast.error("Erro ao recusar proposta");
    } finally {
      setModalAction(null);
    }
  };

  const handleUploadAnexo = async () => {
    if (!novoAnexo) {
      toast.warn("Selecione um arquivo para enviar.");
      return;
    }
    const formData = new FormData();
    formData.append("file", novoAnexo);
    try {
      const response = await fetch(`http://82.29.59.62:9090/anexo-proposta/upload/${propostaId}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Erro ao enviar anexo");
      toast.success("Anexo enviado com sucesso!");
      setNovoAnexo(null);
      fetchPropostaDetalhes();
    } catch (error) {
      console.error("Erro ao enviar anexo:", error);
      toast.error("Erro ao enviar anexo.");
    }
  };

  // Desabilitar botões se o status for Cancelada ou Recusada
  const actionsDisabled =
    proposta?.status === "Cancelada" || proposta?.status === "Recusada";

  if (loading) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="proposta-apolice-container">
      <h1 className="tittledetprop">Detalhes da Proposta / Apólice</h1>

      <div className="detalhes">
        <h2>Informações Gerais</h2>
        <p><strong>Cliente:</strong> {proposta?.clienteNome || "Não informado"}</p>
        <p><strong>Seguradora:</strong> {proposta?.seguradoraNome || "Não informado"}</p>
        <p><strong>Produtor:</strong> {proposta?.produtorNome || "Não informado"}</p>
        <p><strong>Número da Proposta:</strong> {proposta?.nrProposta || "N/A"}</p>
        <p><strong>Número da Apólice:</strong> {proposta?.nrApolice || "N/A"}</p>
        <p><strong>Número do Endosso:</strong> {proposta?.nrEndosso || "N/A"}</p>
        <p>
          <strong>Vigência:</strong> {formatDate(proposta?.dataInicioVigencia)} até {formatDate(proposta?.dataFimVigencia)}
        </p>
        <p>
          <strong>Prêmio Líquido:</strong> {proposta?.premioLiquido ? `R$ ${proposta.premioLiquido}` : "N/A"}
        </p>
        <p>
          <strong>Prêmio Total:</strong> {proposta?.premioTotal ? `R$ ${proposta.premioTotal}` : "N/A"}
        </p>
        <p><strong>Observações:</strong> {proposta?.observacoes || "Nenhuma"}</p>
      </div>

      <div className="acoes">
        <h2>Ações</h2>
        <button
          className="botao editar"
          onClick={() => navigate(`/proposta-apolice/editar/${propostaId}`)}
          disabled={actionsDisabled}
        >
          Editar
        </button>

        {/*
          Substituímos o onClick anterior (handleSimpleAcao("endosso")) pelo handleEndosso abaixo
        */}
        <button
          className="botao endosso"
          onClick={handleEndosso}
          disabled={actionsDisabled}
        >
          Endosso
        </button>

        <button
          className="botao cancelar"
          onClick={() => handleAcaoComModal("cancelar")}
          disabled={actionsDisabled}
        >
          Cancelar
        </button>
        <button
          className="botao recusada"
          onClick={() => handleAcaoComModal("recusar")}
          disabled={actionsDisabled}
        >
          Recusar
        </button>
        <button
          className="botao veiculos"
          onClick={() => setMostrarVeiculos(!mostrarVeiculos)}
          disabled={actionsDisabled}
        >
          {mostrarVeiculos ? "Ocultar Veículos" : "Mostrar Veículos"}
        </button>
      </div>

      {mostrarVeiculos && (
        <div className="veiculos">
          <h2>Veículos Associados</h2>
          {veiculos.length > 0 ? (
            <ul>
              {veiculos.map((vei) => (
                <li key={vei.id}>
                  {vei.placa} - {vei.modelo} ({vei.anoModelo})
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum veículo associado.</p>
          )}
        </div>
      )}

      <div className="pagamentos">
        <h2>Pagamentos</h2>
        {pagamentos.length > 0 ? (
          <ul>
            {pagamentos.map((parcela) => (
              <li key={parcela.id}>
                {parcela.dataVencimento} - R$ {parcela.valor} ({parcela.pago ? "Pago" : "Pendente"})
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum pagamento registrado.</p>
        )}
      </div>

      <div className="comissoes">
        <h2>Comissões</h2>
        {comissoes.length > 0 ? (
          <ul>
            {comissoes.map((cm) => (
              <li key={cm.id}>
                {cm.numeroParcela}ª parcela - {cm.percentualComissao}% (R$ {cm.valorComissao})
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma comissão registrada.</p>
        )}
      </div>

      <div className="anexos">
        <h2>Anexos</h2>
        <ul>
          {anexos.length > 0 ? (
            anexos.map((anexo) => (
              <li key={anexo.id}>
                <a
                  href={`http://82.29.59.62:9090/anexo-proposta/download/${anexo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {anexo.nomeArquivo}
                </a>
              </li>
            ))
          ) : (
            <p>Nenhum anexo.</p>
          )}
        </ul>
        <input type="file" onChange={(e) => setNovoAnexo(e.target.files[0])} />
        <button className="botao anexo" onClick={handleUploadAnexo}>
          Adicionar Anexo
        </button>
      </div>

      {/* Modal para Cancelar/Recusar */}
      {modalAction && (
        <CancelRecusaModal
          action={modalAction}
          onClose={() => setModalAction(null)}
          onSubmit={modalAction === "cancelar" ? submitModalCancelar : submitModalRecusar}
        />
      )}
    </div>
  );
}

export default PropostaApoliceDetalhesPage;
