import React, { useState, useEffect } from 'react';
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
    impSeguradora: ''
  };

  const [objSeguradora, setSeguradora] = useState(seguradoraInicial);
  const [seguradoras, setSeguradoras] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Buscar todas as seguradoras
  const fetchSeguradoras = () => {
    fetch('http://localhost:8080/seguradora')
      .then(response => response.json())
      .then(data => setSeguradoras(data))
      .catch(error => {
        console.error("Erro ao buscar seguradoras:", error);
      });
  };

  useEffect(() => {
    fetchSeguradoras();
  }, []);

  // Lidar com a digitação nos campos
  const digitar = (e) => {
    const { name, value } = e.target;
    setSeguradora({ ...objSeguradora, [name]: value });
  };

  // Abrir e fechar modal de consulta de seguradoras
  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  // Selecionar uma seguradora na lista
  const selecionarSeguradora = (id) => {
    const seguradoraSelecionada = seguradoras.find((s) => s.id === id);
    setSeguradora(seguradoraSelecionada);
    closeModal();
  };

  // Salvar nova seguradora
  const salvar = () => {
    fetch('http://localhost:8080/seguradora/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objSeguradora),
    })
      .then(() => {
        fetchSeguradoras();
        limparFormulario();
      })
      .catch(error => {
        console.error("Erro ao salvar a seguradora:", error);
      });
  };

  // Atualizar seguradora existente
  const atualizar = () => {
    if (!objSeguradora.id) {
      alert("Selecione uma seguradora para editar.");
      return;
    }
    fetch(`http://localhost:8080/seguradora/update/${objSeguradora.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objSeguradora),
    })
      .then(() => {
        fetchSeguradoras();
        alert("Seguradora atualizada com sucesso!");
        limparFormulario();
      })
      .catch(error => {
        console.error("Erro ao atualizar a seguradora:", error);
      });
  };

  // Excluir seguradora
  const excluir = () => {
    if (!objSeguradora.id) {
      alert("Selecione uma seguradora para excluir.");
      return;
    }
    fetch(`http://localhost:8080/seguradora/delete/${objSeguradora.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(() => {
        fetchSeguradoras();
        alert("Seguradora excluída com sucesso!");
        limparFormulario();
      })
      .catch(error => {
        console.error("Erro ao excluir a seguradora:", error);
      });
  };

  // Limpar formulário
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
