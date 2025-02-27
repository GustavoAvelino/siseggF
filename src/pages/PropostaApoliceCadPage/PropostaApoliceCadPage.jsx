import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./PropostaApoliceCadPage.css";

// Importação dos modais (ajuste os caminhos conforme sua estrutura)
import ClienteCadModal from "../../components/ClienteCadModal/ClienteCadModal";
import VeiculoCadModal from "../../components/VeiculoCadModal/VeiculoCadModal";

function PropostaApoliceCadPage() {
  // Parâmetros de rota
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const endossoBase = searchParams.get("endossoBase");

  // Modo edição se "id" existir e não tiver endossoBase
  const isEditing = Boolean(id) && !endossoBase;

  const navigate = useNavigate();
  const location = useLocation();

  // Passo do "wizard"
  const [step, setStep] = useState(1);

  // Dados do formulário
  const [formData, setFormData] = useState({
    clienteId: "",
    seguradoraId: "",
    produtorId: "",
    nrProposta: "",
    nrApolice: "",
    nrEndosso: "",
    dataInicioVigencia: "",
    dataFimVigencia: "",
    dataEmissaoApolice: "",
    apoliceEfetivadaEm: "",
    observacoes: "",
    veiculos: [],
    quantidadeParcelas: "",
    descontoPercentual: "0",
    dataPrimeiroPagamento: "",
    dataBaseParcelas: "",
    premioLiquido: "",
    premioTotal: "",
    valorPrimeiroPagamento: "",
    gradeComissaoId: "",
    comissaoPercentual: "",
    anexos: [],
  });

  // Lists para selects
  const [clientes, setClientes] = useState([]);
  const [seguradoras, setSeguradoras] = useState([]);
  const [produtores, setProdutores] = useState([]);
  const [grades, setGrades] = useState([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);

  // Modais
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isVeiculoModalOpen, setIsVeiculoModalOpen] = useState(false);

  // Carrega options
  useEffect(() => {
    fetchClientes();
    fetchSeguradoras();
    fetchProdutores();
    fetchGradesComissao();
  }, []);

  // Se step 5 e houver clienteId, busca veículos
  useEffect(() => {
    if (step === 5 && formData.clienteId) {
      fetchVeiculosDoCliente(formData.clienteId);
    }
  }, [step, formData.clienteId]);

  // Se for edição ou endosso
  useEffect(() => {
    if (isEditing) {
      fetchProposta(id);
    } else if (endossoBase) {
      fetchPropostaBase(endossoBase);
    }
  }, [isEditing, endossoBase, id]);

  // Aqui capturamos o que vier do state { proposta } caso venha de "AssociacaoPage"
  useEffect(() => {
    if (location.state && location.state.proposta) {
      const propostaImportada = location.state.proposta;
      // console.log("Proposta importada:", propostaImportada);

      // Ajuste conforme os nomes dos campos do PDF e seu form:
      setFormData((prev) => ({
        ...prev,
        clienteId: propostaImportada.clienteId || prev.clienteId,
        // Se quisermos já adicionar o veículo, pode ser algo assim:
        veiculos: propostaImportada.veiculoId ? [propostaImportada.veiculoId] : prev.veiculos,

        nrProposta: propostaImportada.nrProposta || prev.nrProposta,
        nrApolice: propostaImportada.nrApolice || prev.nrApolice,
        // Exemplo: Se extraímos dataVigenciaInicio e dataVigenciaFim do PDF:
        dataInicioVigencia: propostaImportada.dataVigenciaInicio || prev.dataInicioVigencia,
        dataFimVigencia: propostaImportada.dataVigenciaFim || prev.dataFimVigencia,
        // Data da emissão
        dataEmissao: propostaImportada.dataEmissao || prev.dataEmissao,
        // Parcelamento
        dataPrimeiroPagamento: propostaImportada.dataPrimeiraParcela || prev.dataPrimeiroPagamento,
        dataBaseParcelas: propostaImportada.dataSegundaParcela || prev.dataBaseParcelas,
        valorPrimeiroPagamento: propostaImportada.valorPrimeiraParcela || prev.valorPrimeiroPagamento,
        // Valor total do Seguro
        premioTotal: propostaImportada.premio || prev.premioTotal,
        // Número de parcelas
        quantidadeParcelas: propostaImportada.numeroParcelas || prev.quantidadeParcelas,
      }));
    }
  }, [location.state]);

  // Carregar proposta para edição
  const fetchProposta = async (propostaId) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/${propostaId}`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        clienteId: data.clienteId || "",
        seguradoraId: data.seguradoraId || "",
        produtorId: data.produtorId || "",
        nrProposta: data.nrProposta || "",
        nrApolice: data.nrApolice || "",
        nrEndosso: data.nrEndosso || "",
        dataInicioVigencia: data.dataInicioVigencia || "",
        dataFimVigencia: data.dataFimVigencia || "",
        dataEmissaoApolice: data.dataEmissao || "",
        apoliceEfetivadaEm: data.apoliceEfetivadaEm || "",
        observacoes: data.observacoes || "",
        veiculos: data.veiculos ? data.veiculos.map((v) => v.id) : [],
        quantidadeParcelas: data.quantidadeParcelas || "",
        descontoPercentual: data.descontoPercentual !== undefined ? data.descontoPercentual : "0", 
        dataPrimeiroPagamento: data.dataPrimeiroPagamento || "",
        dataBaseParcelas: data.dataBaseParcelas || "",
        premioLiquido: data.premioLiquido || "",
        premioTotal: data.premioTotal || "",
        valorPrimeiroPagamento: data.valorPrimeiroPagamento || "",
        gradeComissaoId: data.gradeComissaoId || "",
        comissaoPercentual: data.comissaoPercentual || "",
        anexos: [],
      }));
    } catch (error) {
      console.error("Erro ao buscar proposta:", error);
      toast.error("Erro ao carregar a proposta para edição.");
    }
  };

  // Carregar dados da proposta-base p/ endosso
  const fetchPropostaBase = async (baseId) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/proposta-apolice/${baseId}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();

      // Preencha somente o que quiser reaproveitar:
      setFormData((prev) => ({
        ...prev,
        clienteId: data.clienteId || "",
        seguradoraId: data.seguradoraId || "",
        produtorId: data.produtorId || "",
        nrProposta: data.nrProposta || "",
        nrApolice: data.nrApolice || "",
        nrEndosso: "",
        dataInicioVigencia: data.dataInicioVigencia || "",
        dataFimVigencia: data.dataFimVigencia || "",
        dataEmissaoApolice: data.dataEmissao || "",
        apoliceEfetivadaEm: "",
        observacoes: "",
        veiculos: [],
        quantidadeParcelas: "",
        descontoPercentual: "",
        dataPrimeiroPagamento: "",
        dataBaseParcelas: "",
        premioLiquido: "",
        premioTotal: "",
        valorPrimeiroPagamento: "",
        gradeComissaoId: "",
        comissaoPercentual: "",
        anexos: [],
      }));
    } catch (error) {
      console.error("Erro ao buscar proposta-base:", error);
      toast.error("Não foi possível carregar dados para o endosso.");
    }
  };

  // Buscas para selects
  const fetchClientes = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    fetch(`http://82.29.59.62:9090/cliente/search?corretoraId=${corretoraId}`)
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  };

  const fetchSeguradoras = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    fetch(`http://82.29.59.62:9090/seguradora/search?corretoraId=${corretoraId}`)
      .then((res) => res.json())
      .then((data) => {
        const seguradorasFormatadas = data.map((s) => ({
          id: s.id,
          nome: s.nome || "Sem nome",
        }));
        setSeguradoras(seguradorasFormatadas);
      })
      .catch((err) => console.error("Erro ao buscar seguradoras:", err));
  };

  const fetchProdutores = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    fetch(`http://82.29.59.62:9090/produtor/search?corretoraId=${corretoraId}`)
      .then((res) => res.json())
      .then((data) => {
        const produtoresFormatados = data.map((p) => ({
          id: p.id,
          nome: p.nome || "Sem nome",
        }));
        setProdutores(produtoresFormatados);
      })
      .catch((err) => console.error("Erro ao buscar produtores:", err));
  };

  const fetchGradesComissao = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    fetch(`http://82.29.59.62:9090/grade-comissao/${corretoraId}`)
      .then((res) => res.json())
      .then((data) => setGrades(data))
      .catch((err) => console.error("Erro ao buscar grades:", err));
  };

  const fetchVeiculosDoCliente = async (clienteId) => {
    try {
      const response = await fetch(`http://82.29.59.62:9090/veiculo/search?clienteId=${clienteId}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setVeiculosDisponiveis(data);
    } catch (error) {
      console.error("Erro ao buscar veículos do cliente:", error);
    }
  };

  // Navegação dos steps
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "0" : value, // Se apagar tudo, volta para "0"
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, anexos: selectedFiles }));
  };

  // Modal
  const openClienteModal = () => setIsClienteModalOpen(true);
  const closeClienteModal = () => setIsClienteModalOpen(false);
  const openVeiculoModal = () => setIsVeiculoModalOpen(true);
  const closeVeiculoModal = () => setIsVeiculoModalOpen(false);

  const onClienteCadastrado = async (clienteSalvo) => {
    setClientes((prev) => [...prev, clienteSalvo]);
    setFormData((prev) => ({ ...prev, clienteId: clienteSalvo.id }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    closeClienteModal();
  };

  const onVeiculoCadastrado = (veiculoSalvo) => {
    setVeiculosDisponiveis((prev) => [...prev, veiculoSalvo]);
    
     setFormData((prev) => ({
      ...prev,
      veiculos: [...prev.veiculos, veiculoSalvo.id]
     }));
    closeVeiculoModal();
  };

  const handleAddVeiculo = (veiculoId) => {
    if (!formData.veiculos.includes(veiculoId)) {
      setFormData((prev) => ({
        ...prev,
        veiculos: [...prev.veiculos, veiculoId],
      }));
    }
  };

  const handleRemoveVeiculo = (veiculoId) => {
    setFormData((prev) => ({
      ...prev,
      veiculos: prev.veiculos.filter((id) => id !== veiculoId),
    }));
  };

  // Upload de anexos
  const uploadArquivos = async (propostaId, arquivos) => {
    if (!arquivos || arquivos.length === 0) {
      return; // Se não tem anexos, não faz nada
    }
    for (const file of arquivos) {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      try {
        const res = await fetch(`http://82.29.59.62:9090/anexo-proposta/upload/${propostaId}`, {
          method: "POST",
          body: formDataToSend,
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Erro ao enviar anexo");
        }
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }
    toast.success("Todos os anexos foram enviados com sucesso!");
  };

  // Salvar ou editar
  const handleSubmit = () => {
    const veiculosFiltrados = formData.veiculos
    .filter((id) => id !== null && id !== "" && !isNaN(id))
    .map((id) => Number(id)); // Converte para números

  if (veiculosFiltrados.length === 0) {
    toast.error("Erro: Nenhum veículo foi selecionado.");
    return;
  }
    const { anexos, ...dataToSend } = {
      ...formData,
      seguradoraId: formData.seguradoraId ? Number(formData.seguradoraId) : null,
    clienteId: formData.clienteId ? Number(formData.clienteId) : null,
    produtorId: formData.produtorId ? Number(formData.produtorId) : null,
    gradeComissaoId: formData.gradeComissaoId ? Number(formData.gradeComissaoId) : null,
    comissaoPercentual: formData.comissaoPercentual ? Number(formData.comissaoPercentual) : null,
    descontoPercentual: formData.descontoPercentual ? Number(formData.descontoPercentual) : null,
    quantidadeParcelas: formData.quantidadeParcelas ? Number(formData.quantidadeParcelas) : null,
    valorPrimeiroPagamento: formData.valorPrimeiroPagamento ? Number(formData.valorPrimeiroPagamento) : null,
    premioLiquido: formData.premioLiquido ? Number(formData.premioLiquido) : null,
    premioTotal: formData.premioTotal ? Number(formData.premioTotal) : null,
    veiculos: veiculosFiltrados,
    };

    if (isEditing) {
      // PUT
      fetch(`http://82.29.59.62:9090/proposta-apolice/atualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })
        .then(async (res) => {
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Erro ao atualizar Proposta/Apolice");
          }
          return res.text();
        })
        .then((data) => {
          toast.success(data || "Proposta/Apolice atualizada com sucesso!");
          navigate(`/proposta-apolice/detalhes/${id}`);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      // POST
      fetch("http://82.29.59.62:9090/proposta-apolice/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })
        .then(async (res) => {
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Erro ao salvar Proposta/Apolice");
          }
          return res.json();
        })
        .then(async (data) => {
          toast.success(data.message || "Proposta/Apolice salva com sucesso!");

          if (anexos && anexos.length > 0) {
            await uploadArquivos(data.propostaId, anexos);
          }
          navigate(`/proposta-apolice/detalhes/${data.propostaId}`);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  // Render step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2>Selecionar ou Cadastrar Cliente</h2>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
            >
              <option value="">-- Selecione --</option>
              {clientes.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.nome} ({cli.cnpjCpf})
                </option>
              ))}
            </select>
            <button className="botao-novo" onClick={openClienteModal}>
              + Cadastrar Novo
            </button>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>Selecionar Seguradora</h2>
            <select
              name="seguradoraId"
              value={formData.seguradoraId}
              onChange={handleChange}
            >
              <option value="">-- Selecione --</option>
              {seguradoras.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  {seg.nome}
                </option>
              ))}
            </select>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Selecionar Produtor</h2>
            <select
              name="produtorId"
              value={formData.produtorId}
              onChange={handleChange}
            >
              <option value="">-- Selecione --</option>
              {produtores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Dados da Apólice/Proposta</h2>
            <div className="campo-linha">
              <label>Nº Proposta:</label>
              <input
                type="text"
                name="nrProposta"
                value={formData.nrProposta}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Nº Apólice:</label>
              <input
                type="text"
                name="nrApolice"
                value={formData.nrApolice}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Nº Endosso:</label>
              <input
                type="text"
                name="nrEndosso"
                value={formData.nrEndosso}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Início Vigência:</label>
              <input
                type="date"
                name="dataInicioVigencia"
                value={formData.dataInicioVigencia}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Fim Vigência:</label>
              <input
                type="date"
                name="dataFimVigencia"
                value={formData.dataFimVigencia}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Emissão Apólice:</label>
              <input
                type="date"
                name="dataEmissaoApolice"
                value={formData.dataEmissaoApolice}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Apólice Efetivada Em:</label>
              <input
                type="date"
                name="apoliceEfetivadaEm"
                value={formData.apoliceEfetivadaEm}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Observações:</label>
              <textarea
                name="observacoes"
                rows={4}
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <h2>Veículos</h2>
            <div className="veiculo-list">
              <div id="subtittleVei">
                <h3>Veículos Disponíveis</h3>
                <button className="botao-novo" onClick={openVeiculoModal}>
                  + Cadastrar Novo
                </button>
              </div>
              {veiculosDisponiveis.map((vei) => (
                <div key={vei.id} className="veiculo-item">
                  <span>
                    {vei.placa} - {vei.modelo}
                  </span>
                  <button onClick={() => handleAddVeiculo(vei.id)}>+</button>
                </div>
              ))}
            </div>
            <div className="veiculos-selecionados">
              <h3>Veículos Selecionados</h3>
              {formData.veiculos.map((vid) => {
                const v = veiculosDisponiveis.find((vx) => vx.id === vid);
                if (!v) return null;
                return (
                  <div key={v.id} className="veiculo-item">
                    <span>
                      {v.placa} - {v.modelo}
                    </span>
                    <button onClick={() => handleRemoveVeiculo(v.id)}>x</button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="step-content">
            <h2>Forma de Pagamento</h2>
            <div className="campo-linha">
              <label>Quantidade Parcelas:</label>
              <input
                type="number"
                name="quantidadeParcelas"
                value={formData.quantidadeParcelas}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Desconto (%):</label>
              <input
                type="number"
                name="descontoPercentual"
                value={formData.descontoPercentual}
                min="0" // Evita valores negativos
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="campo-linha">
              <label>Valor do Primeiro Pagamento:</label>
              <input
                type="number"
                name="valorPrimeiroPagamento"
                value={formData.valorPrimeiroPagamento}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Data 1º Pagamento:</label>
              <input
                type="date"
                name="dataPrimeiroPagamento"
                value={formData.dataPrimeiroPagamento}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Data Base Parcelas:</label>
              <input
                type="date"
                name="dataBaseParcelas"
                value={formData.dataBaseParcelas}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Prêmio Líquido:</label>
              <input
                type="number"
                name="premioLiquido"
                value={formData.premioLiquido}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Prêmio Total:</label>
              <input
                type="number"
                name="premioTotal"
                value={formData.premioTotal}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="step-content">
            <h2>Grade de Comissão</h2>
            <div className="campo-linha">
              <label>Escolher Grade:</label>
              <select
                name="gradeComissaoId"
                value={formData.gradeComissaoId}
                onChange={handleChange}
              >
                <option value="">-- Selecione --</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome} - {g.ramo}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo-linha">
              <label>Comissão (%):</label>
              <input
                type="number"
                name="comissaoPercentual"
                value={formData.comissaoPercentual}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="step-content">
            <h2>Anexos</h2>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
        );
      default:
        return <div>Passo inválido.</div>;
    }
  };

  return (
    <div className="container-proposta">
      <h1>{isEditing ? "Editar Proposta / Apólice" : "Cadastro de Proposta / Apólice"}</h1>

      {isClienteModalOpen && (
        <ClienteCadModal
          onClose={closeClienteModal}
          onClienteCadastrado={onClienteCadastrado}
        />
      )}

      {isVeiculoModalOpen && (
        <VeiculoCadModal
          clienteId={formData.clienteId}
          onClose={closeVeiculoModal}
          onVeiculoCadastrado={onVeiculoCadastrado}
        />
      )}

      {renderStep()}

      <div className="navegacao-botoes">
        {step > 1 && <button onClick={prevStep}>Anterior</button>}
        {step < 8 && <button onClick={nextStep}>Próximo</button>}
        {step === 8 && (
          <button onClick={handleSubmit}>
            {isEditing ? "Editar" : "Salvar"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PropostaApoliceCadPage;
