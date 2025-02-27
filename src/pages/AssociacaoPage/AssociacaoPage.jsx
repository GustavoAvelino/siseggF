import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ClienteCadModal from "../../components/ClienteCadModal/ClienteCadModal";
import VeiculoCadModal from "../../components/VeiculoCadModal/VeiculoCadModal";

import "./AssociacaoPage.css";

function AssociacaoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dados importados do PDF
  const { importacao } = location.state || {};

  // Estado: cliente selecionado, veículos do cliente, veículo selecionado
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [clientesSistema, setClientesSistema] = useState([]);
  const [veiculosCliente, setVeiculosCliente] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState("");

  // Modais
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isVeiculoModalOpen, setIsVeiculoModalOpen] = useState(false);

  // Se não houver "importacao", volta para /importar
  useEffect(() => {
    if (!importacao) {
      navigate("/importar");
    }
  }, [importacao, navigate]);

  // Carrega lista de clientes da corretora
  useEffect(() => {
    const corretoraId = localStorage.getItem("corretoraId");
    if (corretoraId) {
      fetch(`http://82.29.59.62:9090/cliente/search?corretoraId=${corretoraId}`)
        .then((res) => res.json())
        .then((data) => setClientesSistema(data))
        .catch((error) => {
          console.error("Erro ao buscar clientes:", error);
          toast.error("Erro ao buscar clientes");
        });
    }
  }, []);

  // Quando clienteSelecionado mudar, busca veículos do cliente
  useEffect(() => {
  console.log(importacao);
    if (!clienteSelecionado) {
      setVeiculosCliente([]);
      setVeiculoSelecionado("");
      return;
    }
    fetch(`http://82.29.59.62:9090/veiculo/search?clienteId=${clienteSelecionado}`)
      .then((res) => {
        if (res.status === 404) {
          // Se não encontrar nenhum veículo, devolve array vazio
          return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setVeiculosCliente(data);
          setVeiculoSelecionado("");
        } else {
          setVeiculosCliente([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar veículos do cliente:", error);
        toast.error("Erro ao buscar veículos do cliente");
      });
  }, [clienteSelecionado]);

  // Modal Cliente
  const openClienteModal = () => setIsClienteModalOpen(true);
  const closeClienteModal = () => setIsClienteModalOpen(false);

  // Modal Veículo
  const openVeiculoModal = () => setIsVeiculoModalOpen(true);
  const closeVeiculoModal = () => setIsVeiculoModalOpen(false);

  // Callback de cadastro de cliente
  const onClienteCadastrado = (novoCliente) => {
    setClientesSistema((prev) => [...prev, novoCliente]);
    setClienteSelecionado(novoCliente.id);
    toast.success("Cliente cadastrado com sucesso!");
  };

  // Callback de cadastro de veículo
  const onVeiculoCadastrado = (novoVeiculo) => {
    toast.success("Veículo cadastrado com sucesso!");
    setVeiculosCliente((prev) => [...prev, novoVeiculo]);
    setVeiculoSelecionado(novoVeiculo.id);
  };

  // Botão "Associar e Continuar"
  const handleAssociar = () => {
    if (!clienteSelecionado) {
      toast.error("Selecione um cliente para associação");
      return;
    }
  
    // Monta objeto unindo dados do PDF e IDs selecionados
    const propostaPreenchida = {
      ...importacao,
      clienteId: clienteSelecionado,
      veiculoId: veiculoSelecionado ? Number(veiculoSelecionado) : null,
    };
  
    console.log("Enviando para cadastro de proposta:", propostaPreenchida);
    navigate("/proposta-apolice/novo", { state: { proposta: propostaPreenchida } });
  };

  // Se não houver "importacao", retorna nulo
  if (!importacao) {
    return null;
  }

  return (
    <div className="associacao-container">
      <h1 className="associacao-title">Associar Dados do PDF</h1>

      <div className="associacao-content">
        <div className="associacao-info">
          <p><strong>Segurado:</strong> {importacao.clienteNome}</p>
          <p><strong>CPF:</strong> {importacao.clienteCpf}</p>
          <p><strong>Proposta:</strong> {importacao.nrProposta}</p>
          <p><strong>Apólice:</strong> {importacao.nrApolice}</p>
          <p><strong>Valor Total do Seguro:</strong> {importacao.premio}</p>
          <p><strong>Placa:</strong> {importacao.placa}</p>
          {/* Se tiver dataPrimeiraParcela, dataSegundaParcela, etc., exiba também */}
        </div>

        {/* Selecionar Cliente */}
        <div className="associacao-field">
          <label htmlFor="clienteSistema">Selecione o Cliente do Sistema:</label>
          <div className="clienteAssociacao">
            <select
              id="clienteSistema"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
            >
              <option value="">-- Selecione --</option>
              {clientesSistema.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.nome}
                </option>
              ))}
            </select>
            <button onClick={openClienteModal} className="associacao-button">
              + Cadastrar Novo Cliente
            </button>
          </div>
        </div>

        {/* Selecionar Veículo (só aparece se houver clienteSelecionado) */}
        {clienteSelecionado && (
          <div className="associacao-field">
            <label htmlFor="veiculoCliente">Selecione o Veículo do Cliente:</label>
            <div className="veiculoAssociacao">
              <select
                id="veiculoCliente"
                value={veiculoSelecionado}
                onChange={(e) => setVeiculoSelecionado(e.target.value)}
              >
                <option value="">-- Selecione --</option>
                {veiculosCliente.map((vei) => (
                  <option key={vei.id} value={vei.id}>
                    {vei.placa}
                  </option>
                ))}
              </select>
              <button onClick={openVeiculoModal} className="associacao-button">
                + Cadastrar Novo Veículo
              </button>
            </div>
          </div>
        )}

        {/* Botão final */}
        <button onClick={handleAssociar} className="associacao-button">
          Associar e Continuar
        </button>
      </div>

      {/* Modal de Cadastro de Cliente */}
      {isClienteModalOpen && (
        <ClienteCadModal
          onClose={closeClienteModal}
          onClienteCadastrado={onClienteCadastrado}
        />
      )}

      {/* Modal de Cadastro de Veículo */}
      {isVeiculoModalOpen && (
        <VeiculoCadModal
          onClose={closeVeiculoModal}
          onVeiculoCadastrado={onVeiculoCadastrado}
          clienteId={clienteSelecionado}
          placaInicial={importacao.placa}
        />
      )}
    </div>
  );
}

export default AssociacaoPage;
