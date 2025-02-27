import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./VeiculoCadModal.css";

function VeiculoCadModal({ onClose, onVeiculoCadastrado,clienteId }) {
  // Estado do formulário do Veículo
  const [loading, setLoading] = useState(false);
  const [veiculo, setVeiculo] = useState({
    placa: "",
    codigoFipe: "",
    marca: "",
    modelo: "",
    anoModelo: "",
    anoFabricacao: "",
    valorFipe: "",
    combustivel: "",
    chassi: "",
    passageiros: "",
    financiado: "false",
    chassiRemarcado: "false",
    kitGas: "false",
    plotadoOuAdesivado: "false",
    clienteId: clienteId , // Se for necessário vincular a um cliente
  });

   // Atualiza o clienteId caso seja passado depois da montagem
   useEffect(() => {
    if (clienteId) {
      setVeiculo((prev) => ({ ...prev, clienteId }));
    }
  }, [clienteId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVeiculo((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Consulta Placa ao pressionar Enter no campo "placa"
   * ou se quiser chamar em outro momento, fique à vontade.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.name === "placa") {
        consultarPlaca(event.target.value);
      }
    }
  };

  /**
   * Função para consultar a placa no back-end e preencher os campos
   */
  const consultarPlaca = (placaValue) => {
    if (!placaValue) return;
    setLoading(true);

    const url = `http://82.29.59.62:9090/veiculo/consulta-placa-detalhada/${placaValue}`;
    fetch(url)
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const msgErro = await res.text();
          throw new Error(msgErro || "Erro ao consultar placa");
        }
        return res.json();
      })
      .then((data) => {
        // Ajuste conforme o response DTO do seu back-end
        setVeiculo((prev) => ({
          ...prev,
          placa: data.placa || prev.placa,
          codigoFipe: data.codigoFipe || "",
          marca: data.marca || "",
          modelo: data.modelo || "",
          anoModelo: data.anoModelo || "",
          anoFabricacao: data.ano || "", // se o back-end devolve "ano" em vez de anoFabricacao
          valorFipe: data.valorFipe || "",
          combustivel: data.combustivel || "",
          chassi: data.chassiCompleto || "",
          passageiros: data.passageiros || "",
        }));
        toast.success("Dados da placa carregados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao consultar placa:", error);
        toast.error(error.message || "Erro ao consultar placa");
      });
  };

  /**
   * Botão "Salvar" - faz POST para o back-end
   */
  const handleSalvar = () => {
    if (!veiculo.clienteId) {
      toast.error("Erro: Cliente não selecionado.");
      return;
    }

    

    setLoading(true);
    const payload = {
      ...veiculo,
      financiado: veiculo.financiado === "true",
      chassiRemarcado: veiculo.chassiRemarcado === "true",
      kitGas: veiculo.kitGas === "true",
      plotadoOuAdesivado: veiculo.plotadoOuAdesivado === "true",
    };

    fetch("http://82.29.59.62:9090/veiculo/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        setLoading(false);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao salvar veículo");
        }
        return response.json();
      })
      .then((veiculoSalvo) => {
        toast.success("Veículo salvo com sucesso!");
        onVeiculoCadastrado(veiculoSalvo);
        onClose();
      })
      .catch((error) => {
        console.error("Erro ao salvar veículo:", error);
        toast.error(error.message || "Erro ao salvar veículo");
      });
  };
  return (
    <div className="modal-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ color: "#fff" }}>Carregando...</p>
        </div>
      )}

      {/* Overlay de fundo escurecido */}
      <div className="modal-overlay" onClick={onClose}></div>

      <div className={`modal-content ${loading ? "disabled-form" : ""}`}>
        {/* Botão Fechar */}
        <button id="closeVeiculoModal" onClick={onClose} disabled={loading}>
          X
        </button>

        <h1 className="modal-title">Cadastro de Veículo</h1>

        {/* Formulário simples */}
        <div className="form-veiculo-grid">
          <div className="veiinput-field">
            <label htmlFor="placa">Placa:</label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={veiculo.placa}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="codigoFipe">Código Fipe:</label>
            <input
              type="text"
              name="codigoFipe"
              value={veiculo.codigoFipe}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="marca">Marca:</label>
            <input
              type="text"
              name="marca"
              value={veiculo.marca}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="modelo">Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={veiculo.modelo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="anoModelo">Ano Modelo:</label>
            <input
              type="number"
              name="anoModelo"
              value={veiculo.anoModelo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="anoFabricacao">Ano Fabricação:</label>
            <input
              type="number"
              name="anoFabricacao"
              value={veiculo.anoFabricacao}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="valorFipe">Valor Fipe:</label>
            <input
              type="number"
              name="valorFipe"
              value={veiculo.valorFipe}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="combustivel">Combustível:</label>
            <input
              type="text"
              name="combustivel"
              value={veiculo.combustivel}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="chassi">Chassi:</label>
            <input
              type="text"
              name="chassi"
              value={veiculo.chassi}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="passageiros">Passageiros:</label>
            <input
              type="number"
              name="passageiros"
              value={veiculo.passageiros}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="veiinput-field">
            <label htmlFor="financiado">Financiado:</label>
            <select
              name="financiado"
              value={veiculo.financiado}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>

          <div className="veiinput-field">
            <label htmlFor="chassiRemarcado">Chassi Remarcado:</label>
            <select
              name="chassiRemarcado"
              value={veiculo.chassiRemarcado}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>

          <div className="veiinput-field">
            <label htmlFor="kitGas">Kit Gás:</label>
            <select
              name="kitGas"
              value={veiculo.kitGas}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>

          <div className="veiinput-field">
            <label htmlFor="plotadoOuAdesivado">Plotado/Adesivado:</label>
            <select
              name="plotadoOuAdesivado"
              value={veiculo.plotadoOuAdesivado}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
        </div>

        <div className="botoes">
          <button onClick={handleSalvar} disabled={loading}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VeiculoCadModal;
