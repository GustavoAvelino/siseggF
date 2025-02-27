import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SeguradoraCadForm from './../../components/SeguradoraCadForm/SeguradoraCadForm';
import SeguradoraList from './../../components/SeguradoraList/SeguradoraList';

function SeguradoraCad() {
  const seguradoraInicial = {
    id: '',
    nome: '',
    nomefan: '',
    cnpj: '',
    email: '',
    telefone: '',
    susep: '',
    impSeguradora: '',
    corretoraId: ''
  };

  const [objSeguradora, setSeguradora] = useState(seguradoraInicial);
  const [seguradoras, setSeguradoras] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const fetchSeguradoras = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    fetch(`http://82.29.59.62:9090/seguradora/search?corretoraId=${userCorretoraId}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao buscar seguradoras");
        }
        return response.json();
      })
      .then((data) => setSeguradoras(data))
      .catch((error) => {
        console.error("Erro ao buscar seguradoras:", error);
        toast.error(error.message || "Erro ao buscar seguradoras");
      });
  };

  useEffect(() => {
    fetchSeguradoras();
  }, []);

  const digitar = (e) => {
    const { name, value } = e.target;
    setSeguradora({ ...objSeguradora, [name]: value });
  };

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const selecionarSeguradora = (id) => {
    const seguradoraSelecionada = seguradoras.find((s) => s.id === id);
    setSeguradora(seguradoraSelecionada);
    closeModal();
  };

  const salvar = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    const seguradoraParaSalvar = {
      ...objSeguradora,
      corretoraId: userCorretoraId
    };

    fetch('http://82.29.59.62:9090/seguradora/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(seguradoraParaSalvar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao salvar seguradora");
        }
        return response.text();
      })
      .then((message) => {
        toast.success(message || "Seguradora salva com sucesso!");
        fetchSeguradoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar seguradora:", error);
        toast.error(error.message || "Erro ao salvar seguradora");
      });
  };

  const atualizar = () => {
    if (!objSeguradora.id) {
      toast.warning("Selecione uma seguradora para editar.");
      return;
    }

    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    const seguradoraParaAtualizar = {
      ...objSeguradora,
      corretoraId: userCorretoraId
    };

    fetch(`http://82.29.59.62:9090/seguradora/update/${objSeguradora.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(seguradoraParaAtualizar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao atualizar seguradora");
        }
        return response.text();
      })
      .then((message) => {
        toast.success(message || "Seguradora atualizada com sucesso!");
        fetchSeguradoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar seguradora:", error);
        toast.error(error.message || "Erro ao atualizar seguradora");
      });
  };

  const excluir = () => {
    if (!objSeguradora.id) {
      toast.warning("Selecione uma seguradora para excluir.");
      return;
    }

    fetch(`http://82.29.59.62:9090/seguradora/delete/${objSeguradora.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao excluir seguradora");
        }
        return response.text();
      })
      .then((message) => {
        toast.success(message || "Seguradora excluída com sucesso!");
        fetchSeguradoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir seguradora:", error);
        toast.error(error.message || "Erro ao excluir seguradora");
      });
  };

  const limparFormulario = () => {
    setSeguradora(seguradoraInicial);
  };

  return (
    <div className="SeguradoraCad">
      <SeguradoraCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        obj={objSeguradora}
        openModal={openModal}
        atualizar={atualizar}
        excluir={excluir}
      />

      {isOpenModal && (
        <SeguradoraList
          vetor={seguradoras}
          selecionar={selecionarSeguradora}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default SeguradoraCad;
