import React from "react";
import "./ParcelaTable.css";

export const ParcelaTable = ({ parcelas, onChangeParcelas }) => {
  const handleParcelaChange = (index, campo, valor) => {
    const novoArray = [...parcelas];
    novoArray[index] = {
      ...novoArray[index],
      [campo]: parseFloat(valor) || 0,
    };
    onChangeParcelas(novoArray);
  };

  console.log("ParcelaTable -> recebendo parcelas:", parcelas);

  return (
    <div className="parcela-table">
      <h2>Parcelas</h2>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Comissão (%)</th>
            <th>PL na Parcela (%)</th>
          </tr>
        </thead>
        <tbody>
          {parcelas.map((parcela, idx) => (
            <tr key={idx}>
              <td>{parcela.numeroParcela}</td>
              <td>
                <input
                  type="number"
                  value={
                    parcela.comissaoPercentual !== undefined
                      ? parcela.comissaoPercentual
                      : ""
                  }
                  onChange={(e) =>
                    handleParcelaChange(idx, "comissaoPercentual", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  disabled
                  value={
                    parcela.plParcelaPercentual !== undefined
                      ? parcela.plParcelaPercentual
                      : ""
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelaTable;
