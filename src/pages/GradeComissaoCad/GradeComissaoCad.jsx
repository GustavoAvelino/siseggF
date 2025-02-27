import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GradeComissaoForm from "../../components/GradeComissaoForm/GradeComissaoForm";
import GradeComissaoList from "../../components/GradeComissaoList/GradeComissaoList";

function GradeComissaoCad() {
  const corretoraId = localStorage.getItem("corretoraId");

  const gradeInicial = {
    id: "",
    nome: "",
    tipoPagamento: "",
    quantidadeParcelas: 1,
    parcelas: [],
    corretoraId: corretoraId,
  };

  const [grade, setGrade] = useState(gradeInicial);
  const [grades, setGrades] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (corretoraId) {
      fetchGrades();
    } else {
      toast.error("CorretoraId não encontrado. Faça login novamente.");
    }
  }, [corretoraId]);

  const fetchGrades = () => {
    if (!corretoraId) return;

    fetch(`http://82.29.59.62:9090/grade-comissao/${corretoraId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao buscar grades.");
        }
        return res.json();
      })
      .then((data) => setGrades(data))
      .catch((error) => toast.error(error.message || "Erro ao buscar grades."));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrade((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParcelasChange = (novasParcelas) => {
    setGrade((prev) => ({
      ...prev,
      parcelas: novasParcelas,
    }));
  };

  const selecionarGrade = async (id) => {
    const gradeSelecionada = grades.find((g) => g.id === id);
    if (!gradeSelecionada) {
      toast.error("Grade não encontrada.");
      return;
    }

    try {
      const response = await fetch(
        `http://82.29.59.62:9090/grade-comissao/parcelas/${id}`
      );
      if (!response.ok) throw new Error("Erro ao buscar parcelas.");

      const parcelasData = await response.json();

      setGrade({
        ...gradeSelecionada,
        tipoPagamento: gradeSelecionada.tipoPagamento.toString(),
        quantidadeParcelas: gradeSelecionada.quantidadeParcelas,
        parcelas: parcelasData,
      });

      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Erro ao selecionar grade.");
    }
  };

  const salvar = () => {
    if (!corretoraId) {
      toast.error("CorretoraId não encontrado. Não é possível salvar.");
      return;
    }

    const gradeParaSalvar = {
      ...grade,
      corretoraId,
    };

    fetch("http://82.29.59.62:9090/grade-comissao/salvar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradeParaSalvar),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao salvar.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Grade salva com sucesso!");
        fetchGrades();
        limparFormulario();
      })
      .catch((error) => toast.error(error.message || "Erro ao salvar."));
  };

  const atualizar = () => {
    if (!grade.id) {
      toast.warning("Selecione uma grade para editar.");
      return;
    }

    const gradeParaAtualizar = {
      ...grade,
      corretoraId,
    };

    fetch(`http://82.29.59.62:9090/grade-comissao/atualizar/${grade.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradeParaAtualizar),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao atualizar.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Grade atualizada com sucesso!");
        fetchGrades();
        limparFormulario();
      })
      .catch((error) => toast.error(error.message || "Erro ao atualizar."));
  };

  const excluir = () => {
    if (!grade.id) {
      toast.warning("Selecione uma grade para excluir.");
      return;
    }

    fetch(`http://82.29.59.62:9090/grade-comissao/deletar/${grade.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao excluir.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Grade excluída com sucesso!");
        fetchGrades();
        limparFormulario();
      })
      .catch((error) => toast.error(error.message || "Erro ao excluir."));
  };

  const limparFormulario = () => {
    setGrade(gradeInicial);
  };

  return (
    <div className="GradeComissaoCad">
      <GradeComissaoForm
        obj={grade}
        eventoTeclado={handleChange}
        handleParcelasChange={handleParcelasChange}
        salvar={salvar}
        atualizar={atualizar}
        excluir={excluir}
        openModal={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="modal">
          <GradeComissaoList
            selecionar={selecionarGrade}
            closeModal={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default GradeComissaoCad;
