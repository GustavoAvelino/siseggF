import React, { useState, useEffect } from "react";
import ContasAReceberListModal from "../ContasAReceberListModal/ContasAReceberListModal";
import "./ContasAReceberForm.css";

const ContasAReceberForm = ({
  obj = {}, // valor padrão para evitar undefined
  eventoTeclado,
  salvar,
  atualizar,
  excluir,
  openModal,
}) => {
  // Cria um objeto seguro para evitar erros caso obj seja null
  const safeObj = obj || {};

  const [formValido, setFormValido] = useState(false);

  useEffect(() => {
    validarFormulario();
  }, [safeObj]);

  const validarFormulario = () => {
    if (
      safeObj.numeroDocumento &&
      safeObj.produtor &&
      safeObj.dataVencimento &&
      safeObj.numeroParcela &&
      (safeObj.valorParcela !== null && safeObj.valorParcela !== undefined)
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
  };

  // Converte do formato "dd/MM/yyyy" para "yyyy-MM-dd" (para exibição no input date)
  const convertToInputDateFormat = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr; // caso já esteja no formato correto
  };

  return (
    <div className="container-contas">
      <div className="botoes-contas">
       
        {safeObj.id && <button onClick={atualizar}>Editar</button>}
        {safeObj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>

      <h1>Contas a Receber</h1>

      <form>
        <div className="input-field-conta">
          <label>Documento (Proposta):</label>
          <input
            type="text"
            name="numeroDocumento"
            value={safeObj.numeroDocumento || ""}
            onChange={(e) => {
              eventoTeclado(e);
              validarFormulario();
            }}
            onBlur={validarFormulario}
            required
            disabled={!!safeObj.id}  // Desabilita a edição se estiver no modo de edição
          />
        </div>

        <div className="input-field-conta">
          <label>Produtor:</label>
          <input
            type="text"
            name="produtor"
            value={safeObj.produtor || ""}
            onChange={(e) => {
              eventoTeclado(e);
              validarFormulario();
            }}
            onBlur={validarFormulario}
            required
            disabled={!!safeObj.id} // Desabilita em modo de edição
          />
        </div>

        <div className="input-field-conta">
          <label>Data de Vencimento:</label>
          <input
            type="date"
            name="dataVencimento"
            value={convertToInputDateFormat(safeObj.dataVencimento) || ""}
            onChange={(e) => {
              eventoTeclado(e);
              validarFormulario();
            }}
            onBlur={validarFormulario}
            required
          />
        </div>

        <div className="input-container-conta">
          <div className="input-field-conta">
            <label>Nº Parcela:</label>
            <input
              type="number"
              name="numeroParcela"
              value={safeObj.numeroParcela || ""}
              onChange={(e) => {
                eventoTeclado(e);
                validarFormulario();
              }}
              required
            />
          </div>
          <div className="input-field-conta">
            <label>Valor da Parcela:</label>
            <input
              type="number"
              name="valorParcela"
              step="0.01"
              value={safeObj.valorParcela || ""}
              onChange={(e) => {
                eventoTeclado(e);
                validarFormulario();
              }}
              required
            />
          </div>
        </div>

        <div className="input-container-conta">
          <div className="input-field-conta">
            <label>Percentual Comissão:</label>
            <input
              type="number"
              name="percentualComissao"
              step="0.01"
              value={safeObj.percentualComissao || ""}
              onChange={eventoTeclado}
            />
          </div>
          <div className="input-field-conta">
            <label>Valor Comissão:</label>
            <input
              type="number"
              name="valorComissao"
              step="0.01"
              value={safeObj.valorComissao || ""}
              onChange={eventoTeclado}
            />
          </div>
        </div>

        <div className="input-field-conta">
          <label>Status:</label>
          <select
            name="recebido"
            value={safeObj.recebido ? "true" : "false"}
            onChange={(e) =>
              eventoTeclado({
                target: { name: "recebido", value: e.target.value === "true" },
              })
            }
          >
            <option value="false">Pendente</option>
            <option value="true">Pago</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default ContasAReceberForm;
