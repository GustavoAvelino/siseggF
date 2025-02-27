import React, { useState, useEffect } from "react";
import "./GradeComissaoList.css";

export const GradeComissaoList = ({ selecionar, closeModal }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const corretoraId = localStorage.getItem("corretoraId");

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = () => {
    if (!corretoraId) {
      setError("ID da corretora não encontrado.");
      setLoading(false);
      return;
    }

    fetch(`http://82.29.59.62:9090/grade-comissao/${corretoraId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar grades.");
        }
        return response.json();
      })
      .then((data) => {
        setGrades(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="grade-list">
      <h2>Lista de Grades de Comissão</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo Pagamento</th>
              <th>Parcelas</th>
              <th>Selecionar</th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.id}</td>
                  <td>{grade.nome}</td>
                  <td>
                    {grade.tipoPagamento === 1
                      ? "Antecipado"
                      : grade.tipoPagamento === 2
                      ? "Esgotamento"
                      : "Na Parcela"}
                  </td>
                  <td>{grade.quantidadeParcelas}</td>
                  <td>
                    <button
                      className="button-selecionar"
                      onClick={() => selecionar(grade.id)}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhuma grade encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button className="close-btn" onClick={closeModal}>
        Fechar
      </button>
    </div>
  );
};

export default GradeComissaoList;
