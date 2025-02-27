import React, { useState } from "react";
import ContasAReceberForm from "../../components/ContasAReceberForm/ContasAReceberForm";
import ContasAReceberListModal from "../../components/ContasAReceberListModal/ContasAReceberListModal";
import { toast } from "react-toastify";
import "./ContasAReceberPage.css";

const ContasAReceberPage = () => {
  const contaInicial = {
    id: "",
    propostaId: "",
    produtor: "",
    dataVencimento: "",
    numeroParcela: "",
    valorParcela: "",
    percentualComissao: "",
    valorComissao: "",
    recebido: false,
  };

  const [conta, setConta] = useState(contaInicial);
  const [vetorContas, setVetorContas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const eventoTeclado = (e) => {
    const { name, value } = e.target;
    setConta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const salvar = () => {
    fetch("http://82.29.59.62:9090/parc-comissao-doc/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conta),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao salvar conta a receber.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Conta a receber salva com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao salvar."));
  };

  const atualizar = () => {
    if (!conta.id) {
      toast.warning("Selecione uma conta para editar.");
      return;
    }
    fetch(`http://82.29.59.62:9090/parc-comissao-doc/update/${conta.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conta),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao atualizar conta a receber.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Conta a receber atualizada com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao atualizar."));
  };

  const excluir = () => {
    if (!conta.id) {
      toast.warning("Selecione uma conta para excluir.");
      return;
    }
    fetch(`http://82.29.59.62:9090/parc-comissao-doc/delete/${conta.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao excluir conta a receber.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "Conta a Receber excluída com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao excluir."));
  };

  const openModal = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    fetch(`http://82.29.59.62:9090/parc-comissao-doc/search?corretoraId=${corretoraId}`)
      .then((res) => res.json())
      .then((data) => setVetorContas(data))
      .catch((err) => toast.error("Erro ao buscar contas para consulta."));
    setModalOpen(true);
  };

  const selecionar = (id) => {
    // Seleciona uma conta do modal e popula o formulário
    const contaSelecionada = vetorContas.find((c) => c.id === id);
    if (contaSelecionada) {
      setConta(contaSelecionada);
      setModalOpen(false);
    }
  };

  return (
    <div className="contas-page">
      <ContasAReceberForm
        obj={conta}
        eventoTeclado={eventoTeclado}
        salvar={salvar}
        atualizar={atualizar}
        excluir={excluir}
        openModal={openModal}
      />
      {modalOpen && (
        <ContasAReceberListModal
          vetor={vetorContas}
          selecionar={selecionar}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ContasAReceberPage;
