import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "./MulticalculoCadPage.css";

// Modais
import ClienteCadModal from "../../components/ClienteCadModal/ClienteCadModal";
import VeiculoCadModal from "../../components/VeiculoCadModal/VeiculoCadModal";

// Enums para combos
const tipoSeguroOpcoes = ["NOVO", "RENOVACAO_INTERNA", "RENOVACAO_EXTERNA"];
const tipoResidenciaOpcoes = [
  "CASA_SOBRADO",
  "APARTAMENTO_FLAT",
  "CASA_CONDOMINIO_FECHADO",
  "OUTRO",
];
const usoVeiculoTrabalhoOpcoes = [
  "SIM_SEM_GARAGEM",
  "SIM_GARAGEM_PORTAO_MANUAL",
  "SIM_GARAGEM_PORTAO_AUTOMATICO_PORTEIRO",
  "SIM_ESTACIONAMENTO_PRIVADO",
  "NAO",
  "NAO_TRABALHA",
];
const tipoEstacionamentoOpcoes = [
  "SIM_PORTAO_MANUAL",
  "SIM_PORTAO_AUTOMATICO_PORTEIRO",
  "SIM_ESTACIONAMENTO_PRIVADO",
  "NAO",
];
const usoVeiculoFaculdadeOpcoes = [
  "SIM_SEM_GARAGEM",
  "SIM_GARAGEM_PORTAO_MANUAL",
  "SIM_GARAGEM_PORTAO_AUTOMATICO_PORTEIRO",
  "SIM_ESTACIONAMENTO_PRIVADO_PAGO",
  "NAO",
  "NAO_ESTUDA",
];

/**
 * Converte a string do enum (e.g. "SIM_GARAGEM_PORTAO_MANUAL")
 * para algo mais amigável (e.g. "Sim garagem portao manual").
 */
function formatEnumLabel(enumValue) {
  // 1. Substitui underscores por espaços
  let friendly = enumValue.replace(/_/g, " ");

  // 2. Deixa tudo minúsculo
  friendly = friendly.toLowerCase();

  // 3. Capitaliza apenas a primeira letra (opcional, pode melhorar se quiser Title Case)
  //   -> Se quiser Title Case completo, teríamos que dar split nos espaços e capitalizar cada palavra
  friendly = friendly.charAt(0).toUpperCase() + friendly.slice(1);

  return friendly;
}

function MulticalculoCadPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Etapa do wizard
  const [step, setStep] = useState(1);

  // Listas para combos
  const [clientes, setClientes] = useState([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);

  // Modais
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isVeiculoModalOpen, setIsVeiculoModalOpen] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    corretoraId: localStorage.getItem("corretoraId") || "", // Pegando do LocalStorage
    clienteId: "",
    veiculosIds: [],
    tipoSeguro: "",
    vigenciaInicio: "",
    vigenciaFim: "",
    dependente17a26: false,
    idadeDependenteMaisNovo: "",
    tempoUtilizacaoDependentes: "",
    sexoResidente: "MASCULINO",
    residentePrincipal1825: false,
    principalCondutorResideEm: "CASA_SOBRADO",
    veiculoUtilizadoTrabalho: "NAO",
    estacionamentoResidencia: "NAO",
    veiculoUtilizadoFaculdade: "NAO",
    quantidadeVeiculosResidencia: "",
    frequenciaUtilizacaoTrabalho: "",
    mediaKmMes: "",
    principalCondutorRoubado2Anos: false,
    comissaoPercentual: "",
    valorPercentualFipe: "",
    danosMateriais: "",
    danosCorporais: "",
    danosMorais: "",
    mortePassageiro: "",
    invalidezPermanentePassageiro: "",
    despesasHospitalares: "",
  });
  
  // Carregar combo de clientes ao montar
  useEffect(() => {
    fetchClientes();
  }, []);

  // Se for edição, busca os dados do multicalculo
  useEffect(() => {
    if (isEditing) {
      fetchMulticalculo();
    }
  }, [isEditing]);

  // Quando cliente muda, busca veículos
  useEffect(() => {
    if (formData.clienteId) {
      fetchVeiculosDoCliente(formData.clienteId);
    }
  }, [formData.clienteId]);

  // Buscar lista de clientes
  const fetchClientes = async () => {
    try {
      const corretoraId = localStorage.getItem("corretoraId");
      const res = await fetch(
        `http://82.29.59.62:9090/cliente/search?corretoraId=${corretoraId}`
      );
      if (!res.ok) throw new Error("Erro ao buscar clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar clientes");
    }
  };

  // Buscar veículos do cliente
  const fetchVeiculosDoCliente = async (cliId) => {
    try {
      const res = await fetch(
        `http://82.29.59.62:9090/veiculo/search?clienteId=${cliId}`
      );
      if (!res.ok) throw new Error("Erro ao buscar veículos do cliente");
      const data = await res.json();
      setVeiculosDisponiveis(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar veículos do cliente");
    }
  };

  // Buscar multicalculo para edição
  const fetchMulticalculo = async () => {
    try {
      const res = await fetch(`http://82.29.59.62:9090/multicalculo/${id}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erro ao buscar Multicalculo");
      }
      const data = await res.json();
      mapToForm(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const mapToForm = (dto) => {
    setFormData({
      clienteId: dto.cliente?.id || "",
      veiculosIds: dto.veiculos ? dto.veiculos.map((v) => v.id) : [],

      tipoSeguro: dto.tipoSeguro || "",
      vigenciaInicio: dto.vigenciaInicio || "",
      vigenciaFim: dto.vigenciaFim || "",

      dependente17a26: dto.dependente17a26 || false,
      idadeDependenteMaisNovo: dto.idadeDependenteMaisNovo || "",
      tempoUtilizacaoDependentes: dto.tempoUtilizacaoDependentes || "",
      sexoResidente: dto.sexoResidente || "MASCULINO",
      residentePrincipal1825: dto.residentePrincipal1825 || false,
      principalCondutorResideEm: dto.principalCondutorResideEm || "CASA_SOBRADO",
      veiculoUtilizadoTrabalho: dto.veiculoUtilizadoTrabalho || "NAO",
      estacionamentoResidencia: dto.estacionamentoResidencia || "NAO",
      veiculoUtilizadoFaculdade: dto.veiculoUtilizadoFaculdade || "NAO",
      quantidadeVeiculosResidencia: dto.quantidadeVeiculosResidencia || "",
      frequenciaUtilizacaoTrabalho: dto.frequenciaUtilizacaoTrabalho || "",
      mediaKmMes: dto.mediaKmMes || "",
      principalCondutorRoubado2Anos: dto.principalCondutorRoubado2Anos || false,

      comissaoPercentual: dto.comissaoPercentual || "",
      valorPercentualFipe: dto.valorPercentualFipe || "",
      danosMateriais: dto.danosMateriais || "",
      danosCorporais: dto.danosCorporais || "",
      danosMorais: dto.danosMorais || "",
      mortePassageiro: dto.mortePassageiro || "",
      invalidezPermanentePassageiro: dto.invalidezPermanentePassageiro || "",
      despesasHospitalares: dto.despesasHospitalares || "",
    });
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const openClienteModal = () => setIsClienteModalOpen(true);
  const closeClienteModal = () => setIsClienteModalOpen(false);

  const onClienteCadastrado = (novoCliente) => {
    // Adiciona o cliente à lista
    setClientes((prev) => [...prev, novoCliente]);
    // Seleciona como clienteId
    setFormData((prev) => ({ ...prev, clienteId: novoCliente.id }));
    closeClienteModal();
  };

  const openVeiculoModal = () => {
    if (!formData.clienteId) {
      toast.warning("Selecione um cliente antes de cadastrar o veículo.");
      return;
    }
    setIsVeiculoModalOpen(true);
  };
  const closeVeiculoModal = () => setIsVeiculoModalOpen(false);

  const onVeiculoCadastrado = (novoVeiculo) => {
    setVeiculosDisponiveis((prev) => [...prev, novoVeiculo]);
    setFormData((prev) => ({
      ...prev,
      veiculosIds: [...prev.veiculosIds, novoVeiculo.id],
    }));
    closeVeiculoModal();
  };

  const handleAddVeiculo = (veiculoId) => {
    if (!formData.veiculosIds.includes(veiculoId)) {
      setFormData((prev) => ({
        ...prev,
        veiculosIds: [...prev.veiculosIds, veiculoId],
      }));
    }
  };

  const handleRemoveVeiculo = (veiculoId) => {
    setFormData((prev) => ({
      ...prev,
      veiculosIds: prev.veiculosIds.filter((id) => id !== veiculoId),
    }));
  };

  const handleSubmit = async () => {
    const url = isEditing
      ? `http://82.29.59.62:9090/multicalculo/atualizar/${id}`
      : `http://82.29.59.62:9090/multicalculo`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erro ao salvar Multicalculo");
      }
      toast.success(
        isEditing ? "Multicalculo atualizado!" : "Multicalculo salvo!"
      );
      navigate("/multicalculo-list");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Converte a string do enum para rótulo amigável (sem underscores).
   */
  const formatEnumLabel = (enumValue) => {
    // Troca underscore por espaço, deixa minúsculo, depois capitaliza primeira letra
    let friendly = enumValue.replace(/_/g, " ");
    friendly = friendly.toLowerCase();
    friendly = friendly.charAt(0).toUpperCase() + friendly.slice(1);
    return friendly;
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      // Step 1: Dados Gerais
      case 1:
        return (
          <div className="step-content">
            <h2>Dados Gerais</h2>

            {/* Cliente combobox + botão de novo */}
            <div className="campo-linha-cliente">
              <div className="bloco-cliente">
                <label>Cliente:</label>
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
              </div>
              <button className="btn-novo" onClick={openClienteModal}>
                + Novo Cliente
              </button>
            </div>

            <div className="campo-linha">
              <label>Tipo de Seguro:</label>
              <select
                name="tipoSeguro"
                value={formData.tipoSeguro}
                onChange={handleChange}
              >
                <option value="">-- Selecione --</option>
                {tipoSeguroOpcoes.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {formatEnumLabel(tipo)} 
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-linha">
              <label>Vigência Início:</label>
              <input
              className="data-vigencia"
                type="date"
                name="vigenciaInicio"
                value={formData.vigenciaInicio}
                onChange={handleChange}
              />
            </div>

            <div className="campo-linha">
              <label>Vigência Fim:</label>
              <input
              className="data-vigencia"
                type="date"
                name="vigenciaFim"
                value={formData.vigenciaFim}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      // Step 2: Perfil de Risco
      case 2:
        return (
          <div className="step-content">
            <h2>Perfil de Risco</h2>

            <div className="duas-colunas">
              <div className="coluna">
                <div className="campo-linha-menor">
                  <label>Dependente 17 a 26?</label>
                  <input
                    type="checkbox"
                    name="dependente17a26"
                    checked={formData.dependente17a26}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Idade do Dependente Mais Novo:</label>
                  <input
                    type="number"
                    name="idadeDependenteMaisNovo"
                    value={formData.idadeDependenteMaisNovo}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Tempo de uso pelos dependentes (Dias por Semana):</label>
                  <input
                    type="number"
                    name="tempoUtilizacaoDependentes"
                    value={formData.tempoUtilizacaoDependentes}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Sexo Residente:</label>
                  <select
                    name="sexoResidente"
                    value={formData.sexoResidente}
                    onChange={handleChange}
                  >
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>

                <div className="campo-linha-menor">
                  <label>Condutor 18 a 25?</label>
                  <input
                    type="checkbox"
                    name="residentePrincipal1825"
                    checked={formData.residentePrincipal1825}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Residência Principal:</label>
                  <select
                    name="principalCondutorResideEm"
                    value={formData.principalCondutorResideEm}
                    onChange={handleChange}
                  >
                    {tipoResidenciaOpcoes.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {formatEnumLabel(tipo)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="coluna">
                <div className="campo-linha">
                  <label>Veículo usado para Trabalho:</label>
                  <select
                    name="veiculoUtilizadoTrabalho"
                    value={formData.veiculoUtilizadoTrabalho}
                    onChange={handleChange}
                  >
                    {usoVeiculoTrabalhoOpcoes.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {formatEnumLabel(tipo)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-linha">
                  <label>Estacionamento residência:</label>
                  <select
                    name="estacionamentoResidencia"
                    value={formData.estacionamentoResidencia}
                    onChange={handleChange}
                  >
                    {tipoEstacionamentoOpcoes.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {formatEnumLabel(tipo)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-linha">
                  <label>Veículo usado para Faculdade:</label>
                  <select
                    name="veiculoUtilizadoFaculdade"
                    value={formData.veiculoUtilizadoFaculdade}
                    onChange={handleChange}
                  >
                    {usoVeiculoFaculdadeOpcoes.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {formatEnumLabel(tipo)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo-linha">
                  <label>Qtd. veículos na residência:</label>
                  <input
                    type="number"
                    name="quantidadeVeiculosResidencia"
                    value={formData.quantidadeVeiculosResidencia}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Frequência uso p/ trabalho (Dias por Semana):</label>
                  <input
                    type="number"
                    name="frequenciaUtilizacaoTrabalho"
                    value={formData.frequenciaUtilizacaoTrabalho}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha">
                  <label>Média km/mês:</label>
                  <input
                    type="number"
                    name="mediaKmMes"
                    value={formData.mediaKmMes}
                    onChange={handleChange}
                  />
                </div>

                <div className="campo-linha-menor">
                  <label>Roubado últimos 2 anos?</label>
                  <input
                    type="checkbox"
                    name="principalCondutorRoubado2Anos"
                    checked={formData.principalCondutorRoubado2Anos}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // Step 3: Escolha de Veículos + Botão Novo
      case 3:
        return (
          <div className="step-content">
            <h2>Veículos</h2>

            <div className="veiculo-list-header">
              <label>Veículos do Cliente:</label>
              <button onClick={openVeiculoModal} className="btn-novo">
                + Novo Veículo
              </button>
            </div>

            <div className="veiculo-disponiveis-list">
              {veiculosDisponiveis.map((vei) => (
                <div key={vei.id} className="veiculo-item">
                  <span>
                    {vei.placa} - {vei.modelo}
                  </span>
                  <button onClick={() => handleAddVeiculo(vei.id)}>+</button>
                </div>
              ))}
            </div>

            <div className="veiculo-selecionados-list">
              <h3>Veículos Selecionados</h3>
              {formData.veiculosIds.map((vid) => {
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

      // Step 4: Coberturas
      case 4:
        return (
          <div className="step-content">
            <h2>Coberturas</h2>
            <div className="campo-linha">
              <label>Comissão (%):</label>
              <input
                type="number"
                name="comissaoPercentual"
                value={formData.comissaoPercentual}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Valor %Fipe:</label>
              <input
                type="number"
                name="valorPercentualFipe"
                value={formData.valorPercentualFipe}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Danos Materiais:</label>
              <input
                type="number"
                name="danosMateriais"
                value={formData.danosMateriais}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Danos Corporais:</label>
              <input
                type="number"
                name="danosCorporais"
                value={formData.danosCorporais}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Danos Morais:</label>
              <input
                type="number"
                name="danosMorais"
                value={formData.danosMorais}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Morte Passageiro:</label>
              <input
                type="number"
                name="mortePassageiro"
                value={formData.mortePassageiro}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Invalidez Permanente Passageiro:</label>
              <input
                type="number"
                name="invalidezPermanentePassageiro"
                value={formData.invalidezPermanentePassageiro}
                onChange={handleChange}
              />
            </div>
            <div className="campo-linha">
              <label>Despesas Hospitalares:</label>
              <input
                type="number"
                name="despesasHospitalares"
                value={formData.despesasHospitalares}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      default:
        return <div>Passo inválido.</div>;
    }
  };

  return (
    <div className="multicalculo-cad-container">
      <h1>{isEditing ? "Editar Multicalculo" : "Novo Multicalculo"}</h1>

      {isClienteModalOpen && (
        <ClienteCadModal
          onClose={closeClienteModal}
          onClienteCadastrado={onClienteCadastrado}
        />
      )}
      {isVeiculoModalOpen && (
        <VeiculoCadModal
          onClose={closeVeiculoModal}
          onVeiculoCadastrado={onVeiculoCadastrado}
          clienteId={formData.clienteId}
        />
      )}

      {renderStep()}

      <div className="navegacao-botoes">
        {step > 1 && <button onClick={prevStep}>Anterior</button>}
        {step < 4 && <button onClick={nextStep}>Próximo</button>}
        {step === 4 && (
          <button onClick={handleSubmit}>
            {isEditing ? "Atualizar" : "Salvar"}
          </button>
        )}
      </div>
    </div>
  );
}

export default MulticalculoCadPage;
