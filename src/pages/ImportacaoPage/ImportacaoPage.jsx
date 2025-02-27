import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ImportacaoPage.css";
function ImportacaoPage() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para importar");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://82.29.59.62:9090/api/importacao", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Erro ao importar arquivo");
      }
      const data = await response.json();
      // Após importar, navega para a tela de associação, passando os dados importados
      navigate("/associar", { state: { importacao: data } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="importacao-container">
      <h1 className="importacao-title">Importar PDF</h1>
      <div className="importacao-content">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="importacao-file-input"
        />
        <button onClick={handleImport} className="importacao-button">
          Importar
        </button>
      </div>
    </div>
  );
}

export default ImportacaoPage;
