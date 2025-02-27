import React, { useEffect, useState } from "react";

function AnexosList({ propostaId }) {
  const [anexos, setAnexos] = useState([]);

  // Ao montar (ou ao mudar o propostaId), busca anexos
  useEffect(() => {
    if (!propostaId) return; // Se não tiver propostaId ainda, não busca

    fetch(`http://82.29.59.62:9090/anexo-proposta/${propostaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar anexos");
        return res.json();
      })
      .then((data) => {
        setAnexos(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [propostaId]);

  // Forma A: <a> com href para download
  // Você pode simplesmente renderizar um link com target _blank
  const renderLink = (anexoId, nomeArquivo) => {
    return (
      <a
        href={`http://82.29.59.62:9090/anexo-proposta/download/${anexoId}`}
        download={nomeArquivo} // Sugere nome do arquivo para o navegador
      >
        {nomeArquivo}
      </a>
    );
  };

  // Forma B: função que dispara window.open() (caso prefira)
  const handleDownload = (anexoId) => {
    // Abre em nova aba (ou troque para _self, se quiser mesma aba)
    window.open(`http://82.29.59.62:9090/anexo-proposta/download/${anexoId}`, "_blank");
  };

  return (
    <div>
      <h3>Anexos da Proposta {propostaId}</h3>
      {anexos.length === 0 && <p>Nenhum anexo encontrado.</p>}

      <ul>
        {anexos.map((anexo) => (
          <li key={anexo.id}>
            {/* Exemplo com Forma A (link direto) */}
            {renderLink(anexo.id, anexo.nomeArquivo)}

            {/* OU, se preferir Forma B (botão) */}
            {/* 
              <button onClick={() => handleDownload(anexo.id)}>
                Baixar {anexo.nomeArquivo}
              </button>
            */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnexosList;
