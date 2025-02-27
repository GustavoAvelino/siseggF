import React, { useState } from "react";
import BaixaParcelaForm from "../../components/BaixaParcelaForm/BaixaParcelaForm";
import BaixaParcelaListModal from "../../components/BaixaParcelaListModal/BaixaParcelaListModal";
import { toast } from "react-toastify";
import "./BaixaParcelaPage.css";

const BaixaParcelaPage = () => {
  // Agora, armazenamos também o numeroDocumento para exibição
  const contaInicial = {
    id: "",
    propostaId: "", // Usado para envio no back-end
    numeroDocumento: "", // Exibido no form (como em Contas a Receber)
    segurado: "",
    dataVencimento: "",
    numeroParcela: "",
    valorParcela: "",
    pago: false,
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
    if (!conta.propostaId) {
      toast.warning("Selecione um documento!");
      return;
    }
    fetch("http://82.29.59.62:9090/parcela-pagamento/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propostaId: parseInt(conta.propostaId),
        numeroParcela: parseInt(conta.numeroParcela),
        valorParcela: parseFloat(conta.valorParcela),
        dataVencimento: conta.dataVencimento,
        pago: conta.pago,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao salvar parcela.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "parcela salva com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao salvar."));
  };

  const atualizar = () => {
    if (!conta.id) {
      toast.warning("Selecione uma parcela para editar.");
      return;
    }
    fetch(`http://82.29.59.62:9090/parcela-pagamento/update/${conta.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propostaId: parseInt(conta.propostaId),
        numeroParcela: parseInt(conta.numeroParcela),
        valorParcela: parseFloat(conta.valorParcela),
        dataVencimento: conta.dataVencimento,
        pago: conta.pago,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao atualizar parcela.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "parcela atualizada com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao atualizar."));
  };

  const excluir = () => {
    if (!conta.id) {
      toast.warning("Selecione uma parcela para excluir.");
      return;
    }
    fetch(`http://82.29.59.62:9090/parcela-pagamento/delete/${conta.id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao excluir parcela.");
        }
        return res.text();
      })
      .then((message) => {
        toast.success(message || "parcela excluída com sucesso!");
        setConta(contaInicial);
      })
      .catch((error) => toast.error(error.message || "Erro ao excluir."));
  };

  const openModal = () => {
    const corretoraId = localStorage.getItem("corretoraId");
    if (!corretoraId) {
      toast.warning("Corretora não identificada.");
      return;
    }
    fetch(`http://82.29.59.62:9090/parcela-pagamento/search?corretoraId=${corretoraId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || "Erro ao buscar parcela.");
        }
        return res.json();
      })
      .then((data) => setVetorContas(data))
      .catch((err) => toast.error("Erro ao buscar parcela."));
    
    setModalOpen(true);
  };

  // A função de seleção agora deve atualizar tanto o "propostaId" quanto o "numeroDocumento"
  const selecionar = (id) => {
    const selecionada = vetorContas.find((c) => c.id === id);
    if (selecionada) {
      setConta({
        id: selecionada.id,
        propostaId: selecionada.propostaId, // necessário para o back-end
        numeroDocumento: selecionada.numeroDocumento || "", // exibido no form
        segurado: selecionada.segurado || "",
        dataVencimento: selecionada.dataVencimento || "",
        numeroParcela: selecionada.numeroParcela || "",
        valorParcela: selecionada.valorParcela || "",
        pago: selecionada.pago || false,
      });
      setModalOpen(false);
    }
  };

  return (
    <div className="baixa-parcela-page">
      <BaixaParcelaForm
        obj={conta}
        eventoTeclado={eventoTeclado}
        salvar={salvar}
        atualizar={atualizar}
        excluir={excluir}
        openModal={openModal}
      />
      {modalOpen && (
        <BaixaParcelaListModal
          vetor={vetorContas}
          selecionar={selecionar}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BaixaParcelaPage;
