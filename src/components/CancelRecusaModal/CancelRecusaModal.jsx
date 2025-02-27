import React, { useState } from "react";
import "./CancelRecusaModal.css";

function CancelRecusaModal({ action, onClose, onSubmit }) {
  // Função para obter a data atual no fuso horário de Brasília no formato "YYYY-MM-DD"
  const getTodayBrasilia = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(now);
  };

  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState(getTodayBrasilia());

  const handleSubmit = () => {
    if (!motivo || !data) {
      alert("Por favor, preencha os campos de motivo e data.");
      return;
    }
    onSubmit({ motivo, data });
  };

  return (
    <div className="cancelRecusaModal-overlay">
      <div className="cancelRecusaModal-content">
        <h3>{action === "cancelar" ? "Cancelar Proposta" : "Recusar Proposta"}</h3>
        <div className="cancelRecusaModal-field">
          <label>Motivo:</label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <div className="cancelRecusaModal-field">
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div className="cancelRecusaModal-buttons">
          <button onClick={handleSubmit}>Prosseguir</button>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default CancelRecusaModal;
