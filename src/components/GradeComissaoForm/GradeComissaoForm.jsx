import React, { useState, useEffect } from "react";
import ParcelaTable from "../ParcelaTable/ParcelaTable";
import "./GradeComissaoForm.css";

export const GradeComissaoForm = ({
  obj,
  eventoTeclado,
  handleParcelasChange,
  salvar,
  atualizar,
  excluir,
  openModal,
}) => {
  const [qtdParcelasInput, setQtdParcelasInput] = useState("1");
  const [tipoPagamento, setTipoPagamento] = useState("");
  const [formValido, setFormValido] = useState(false);

  useEffect(() => {
    setQtdParcelasInput(String(obj.quantidadeParcelas || 1));
    setTipoPagamento(obj.tipoPagamento || "");
    validarFormulario();
  }, [obj]);

  const validarFormulario = () => {
    if (
      obj.nome &&
      obj.tipoPagamento &&
      obj.quantidadeParcelas &&
      obj.parcelas.length > 0
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
  };

  const onBlurQtdParcelas = (e) => {
    let valorNumerico = parseInt(e.target.value, 10);
    if (!valorNumerico || valorNumerico < 1) {
      valorNumerico = 1;
    }

    eventoTeclado({
      target: { name: "quantidadeParcelas", value: valorNumerico },
    });
    gerarParcelas(valorNumerico, tipoPagamento);
    setQtdParcelasInput(String(valorNumerico));
    validarFormulario();
  };

  const onChangeQtdParcelas = (e) => {
    setQtdParcelasInput(e.target.value);
  };

  const onChangeTipoPagamento = (e) => {
    setTipoPagamento(e.target.value);
    eventoTeclado(e);

    let qtd = parseInt(qtdParcelasInput, 10);
    if (!qtd || qtd < 1) {
      qtd = 1;
      setQtdParcelasInput("1");
      eventoTeclado({
        target: { name: "quantidadeParcelas", value: qtd },
      });
    }

    gerarParcelas(qtd, e.target.value);
    validarFormulario();
  };

  const gerarParcelas = (qtd, tp) => {
    const quantidade = parseInt(qtd, 10) || 1;
    const tipoPag = (tp || "").toString();

    let novasParcelas = [];

    if (tipoPag === "1" || tipoPag === "2") {
      novasParcelas = Array.from({ length: quantidade }, (_, i) => ({
        numeroParcela: i + 1,
        comissaoPercentual: 0,
        plParcelaPercentual: i === 0 ? 100 : 0,
      }));
    } else if (tipoPag === "3") {
      const perc = 100 / quantidade;
      novasParcelas = Array.from({ length: quantidade }, (_, i) => ({
        numeroParcela: i + 1,
        comissaoPercentual: 0,
        plParcelaPercentual: parseFloat(perc.toFixed(2)),
      }));
    } else {
      novasParcelas = [];
    }

    console.log(`Gerando parcelas para tipo ${tipoPag}:`, novasParcelas);
    handleParcelasChange(novasParcelas);
    validarFormulario();
  };

  return (
    <div className="container-grade">
      <div className="botoes-grade">
        <button onClick={salvar} disabled={!formValido} className={!formValido ? 'disabled-button' : ''}>
          Salvar
        </button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>

      <h1>Cadastro de Grade de Comissão</h1>

      <form>
        <div className="input-field-grade">
          <label>Nome da Grade:</label>
          <input
            type="text"
            name="nome"
            value={obj.nome || ""}
            onChange={(e) => {
              eventoTeclado(e);
              validarFormulario();
            }}
            onBlur={validarFormulario}
            required
          />
        </div>

        <div className="input-container">
          <div className="input-field-grade">
            <label>Tipo de Pagamento:</label>
            <select
              name="tipoPagamento"
              value={tipoPagamento}
              onChange={onChangeTipoPagamento}
              required
            >
              <option value="">Selecione...</option>
              <option value="1">Antecipado</option>
              <option value="2">Esgotamento</option>
              <option value="3">Na Parcela</option>
            </select>
          </div>

          <div className="input-field-grade">
            <label>Quantidade de Parcelas:</label>
            <input
              type="number"
              name="quantidadeParcelas"
              value={qtdParcelasInput}
              onChange={onChangeQtdParcelas}
              onBlur={onBlurQtdParcelas}
              required
            />
          </div>
        </div>

        <ParcelaTable
          parcelas={obj.parcelas || []}
          onChangeParcelas={handleParcelasChange}
        />
      </form>
    </div>
  );
};

export default GradeComissaoForm;
