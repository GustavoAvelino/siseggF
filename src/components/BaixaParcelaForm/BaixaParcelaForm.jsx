import React, { useState, useEffect } from "react";
import "./BaixaParcelaForm.css";

const BaixaParcelaForm = ({
  obj = {}, // valor padrão para evitar undefined
  eventoTeclado,
  salvar,
  atualizar,
  excluir,
  openModal,
}) => {
  const safeObj = obj || {};
  const [formValido, setFormValido] = useState(false);

  useEffect(() => {
    validarFormulario();
  }, [safeObj]);

  const validarFormulario = () => {
    if (
      safeObj.numeroDocumento &&
      safeObj.dataVencimento &&
      safeObj.numeroParcela &&
      safeObj.valorParcela
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
  };

  const convertToInputDateFormat = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
    return dateStr;
  };

  return (
    <div className="container-baixa-parcela">
      <div className="botoes-baixa-parcela">
        {safeObj.id && <button onClick={atualizar}>Editar</button>}
        {safeObj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>

      <h1>Baixa de Parcelas</h1>

      <form>
       
        <div className="input-field-baixa">
          <label>Documento:</label>
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
            disabled={!!safeObj.id}  // Bloqueia edição se já estiver em modo edição
          />
        </div>

        {/* Campo opcional para exibição do segurado */}
        <div className="input-field-baixa">
          <label>Segurado (visualização):</label>
          <input
            type="text"
            name="segurado"
            value={safeObj.segurado || ""}
            onChange={eventoTeclado}
            disabled
          />
        </div>

        <div className="input-field-baixa">
          <label>Data de Vencimento:</label>
          <input
            type="date"
            name="dataVencimento"
            value={convertToInputDateFormat(safeObj.dataVencimento)}
            onChange={(e) => {
              eventoTeclado(e);
              validarFormulario();
            }}
            onBlur={validarFormulario}
            required
          />
        </div>

        <div className="input-container-baixa">
          <div className="input-field-baixa">
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
          <div className="input-field-baixa">
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

        <div className="input-field-baixa">
          <label>Status:</label>
          <select
            name="pago"
            value={safeObj.pago ? "true" : "false"}
            onChange={(e) =>
              eventoTeclado({
                target: { name: "pago", value: e.target.value === "true" },
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

export default BaixaParcelaForm;
