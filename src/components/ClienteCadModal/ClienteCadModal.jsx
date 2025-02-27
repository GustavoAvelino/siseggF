import React, { useState } from "react";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";        // <--- Import para mascara de telefone
import { cpf, cnpj } from "cpf-cnpj-validator";  // <--- Import para validação CPF/CNPJ
import "./ClienteCadModal.css";

function ClienteCadModal({ onClose, onClienteCadastrado }) {
  const [loading, setLoading] = useState(false);
  const [erroCnpjCpf, setErroCnpjCpf] = useState("");

  const [cliente, setCliente] = useState({
    nome: "",
    nomeSocial: "",
    cnpjCpf: "",
    dataNascimento: "",
    sexo: "",
    estadoCivil: "",
    email: "",
    telefone: "",
  });

  // Aplica máscara ao CPF/CNPJ, retornando string formatada
  const aplicarMascaraCnpjCpf = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length === 11) {
      // CPF
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numeros.length === 14) {
      // CNPJ
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return valor;
  };

  // Valida se é CPF ou CNPJ válido (sem setar state)
  const ehValidoCnpjCpf = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length === 11) {
      // CPF
      return cpf.isValid(numeros);
    } else if (numeros.length === 14) {
      // CNPJ
      return cnpj.isValid(numeros);
    }
    return false;
  };

  // Formata e valida CPF/CNPJ ao perder o foco
  const handleBlurCnpjCpf = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    const valorFormatado = aplicarMascaraCnpjCpf(valor);

    // Atualiza somente se mudar
    if (cliente.cnpjCpf !== valorFormatado) {
      setCliente((prev) => ({ ...prev, cnpjCpf: valorFormatado }));
    }

    // Seta erro se inválido
    if (!ehValidoCnpjCpf(valor)) {
      setErroCnpjCpf("CPF/CNPJ inválido ou incompleto.");
    } else {
      setErroCnpjCpf("");
    }
  };

  // Captura mudanças nos demais campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Verifica se o formulário está válido sem chamar setState
  const isFormValido = () => {
    const cnpjCpfLimpo = cliente.cnpjCpf.replace(/\D/g, "");
    return (
      cliente.nome.trim() !== "" &&
      cnpjCpfLimpo !== "" &&
      ehValidoCnpjCpf(cnpjCpfLimpo) &&
      erroCnpjCpf === ""
    );
  };

  // Salvar no back-end
  const handleSalvar = async () => {
    if (!isFormValido()) {
      toast.error("Preencha os campos obrigatórios corretamente!");
      return;
    }

    setLoading(true);
    const corretoraId = localStorage.getItem("corretoraId") || "";
    const payload = { ...cliente, corretoraId };

    try {
      const response = await fetch("http://82.29.59.62:9090/cliente/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Erro ao salvar cliente");
      }

      // Verifica o tipo de conteúdo da resposta
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      toast.success(typeof data === "string" ? data : "Cliente salvo com sucesso!");

      onClienteCadastrado(data); // Atualiza combo de clientes no pai
      onClose();                 // Fecha modal
      
    } catch (error) {
      toast.error(error.message || "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ color: "#fff" }}>Carregando...</p>
        </div>
      )}

      <div className="modal-overlay" onClick={onClose} />

      <div className={`modal-content ${loading ? "disabled-form" : ""}`}>
        <button
          id="closeClienteModal"
          onClick={onClose}
          disabled={loading}
        >
          X
        </button>

        <h2>Cadastro de Cliente</h2>

        <div className="cliente-form-grid">
          {/* Nome */}
          <div className="form-field">
            <label>Nome <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="nome"
              value={cliente.nome}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          {/* Nome Social */}
          <div className="form-field">
            <label>Nome Social:</label>
            <input
              type="text"
              name="nomeSocial"
              value={cliente.nomeSocial}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* CNPJ/CPF */}
          <div className="form-field">
            <label>CNPJ/CPF <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="cnpjCpf"
              value={cliente.cnpjCpf}
              onChange={handleChange}
              onBlur={handleBlurCnpjCpf}
              disabled={loading}
              required
            />
            {erroCnpjCpf && <span className="erro-texto">{erroCnpjCpf}</span>}
          </div>

          {/* Data Nascimento */}
          <div className="form-field">
            <label>Data de Nascimento:</label>
            <input
              type="date"
              name="dataNascimento"
              value={cliente.dataNascimento}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Sexo */}
          <div className="form-field">
            <label>Sexo:</label>
            <select
              name="sexo"
              value={cliente.sexo}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Estado Civil */}
          <div className="form-field">
            <label>Estado Civil:</label>
            <select
              name="estadoCivil"
              value={cliente.estadoCivil}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Selecione</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viúvo">Viúvo</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Telefone */}
          <div className="form-field">
            <label>Telefone:</label>
            {/* Aqui aplicamos a máscara de telefone usando InputMask */}
            <InputMask
              mask="(99) 99999-9999"
              value={cliente.telefone}
              onChange={(e) => setCliente((prev) => ({ ...prev, telefone: e.target.value }))}
              disabled={loading}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  name="telefone"
                />
              )}
            </InputMask>
          </div>

          {/* Email */}
          <div className="form-field">
            <label>E-mail:</label>
            <input
              type="email"
              name="email"
              value={cliente.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="botoes-modal">
          <button
            onClick={handleSalvar}
            disabled={loading || !isFormValido()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClienteCadModal;
