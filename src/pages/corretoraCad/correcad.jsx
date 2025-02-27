import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CorreCadForm from './../../components/CorreCadForm/CorreCadForm';
import CorreListTable from './../../components/CorreList/CorreListTable';

function CorretoraCad() {
  const corretoraInicial = {
    id: '',
    nome: '',
    nomefan: '',
    rua: '',
    bairro: '',
    numero: '',
    cidade: '',
    estado: '',
    cnpj: '',
    email: '',
    telefone: '',
    susep: '',
    impCorretora: '',
  };

  const [objCorretora, setCorretora] = useState(corretoraInicial);
  const [corretoras, setCorretoras] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCorretoras = () => {
    fetch('http://82.29.59.62:9090/corretora')
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao buscar corretoras");
        }
        return response.json();
      })
      .then((data) => setCorretoras(data))
      .catch((error) => {
        console.error("Erro ao buscar corretoras:", error);
        toast.error(error.message || "Erro ao buscar corretoras");
      });
  };

  useEffect(() => {
    fetchCorretoras();
  }, []);

  const digitar = (e) => {
    const { name, value } = e.target;
    setCorretora({ ...objCorretora, [name]: value });
  };

  const openModal = () => {
    fetchCorretoras();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const selecionarCorretora = (id) => {
    const corretoraSelecionada = corretoras.find(
      (corretora) => corretora.id === id
    );
    if (!corretoraSelecionada) return;

    let rua = '', bairro = '', numero = '';
    if (corretoraSelecionada.endereco) {
      const partes = corretoraSelecionada.endereco.split(',');
      if (partes.length === 3) {
        rua = partes[0].trim();
        bairro = partes[1].trim();
        numero = partes[2].trim();
      } else {
        rua = partes[0] ? partes[0].trim() : '';
        bairro = partes[1] ? partes[1].trim() : '';
        numero = partes[2] ? partes[2].trim() : '';
      }
    }

    setCorretora({
      id: corretoraSelecionada.id,
      nome: corretoraSelecionada.nome,
      nomefan: corretoraSelecionada.nomefan,
      rua: rua,
      bairro: bairro,
      numero: numero,
      cidade: corretoraSelecionada.cidade,
      estado: corretoraSelecionada.estado,
      cnpj: corretoraSelecionada.cnpj,
      email: corretoraSelecionada.email,
      telefone: corretoraSelecionada.telefone,
      susep: corretoraSelecionada.susep,
      impCorretora: corretoraSelecionada.impCorretora
    });

    closeModal();
  };

  const salvar = () => {
    const enderecoCompleto = `${objCorretora.rua}, ${objCorretora.bairro}, ${objCorretora.numero}`;
    
    const corretoraToSave = {
      id: objCorretora.id || null,
      nome: objCorretora.nome,
      nomefan: objCorretora.nomefan,
      endereco: enderecoCompleto,
      cidade: objCorretora.cidade,
      estado: objCorretora.estado,
      cnpj: objCorretora.cnpj,
      email: objCorretora.email,
      telefone: objCorretora.telefone,
      susep: objCorretora.susep,
      impCorretora: objCorretora.impCorretora
    };

    fetch('http://82.29.59.62:9090/corretora/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(corretoraToSave),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao salvar a corretora");
        }
        return response.json();
      })
      .then(() => {
        toast.success("Corretora salva com sucesso!");
        fetchCorretoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar a corretora:", error);
        toast.error(error.message || "Erro ao salvar a corretora");
      });
  };

  const atualizar = () => {
    if (!objCorretora.id) {
      toast.warning("Selecione uma corretora para editar.");
      return;
    }

    const enderecoCompleto = `${objCorretora.rua}, ${objCorretora.bairro}, ${objCorretora.numero}`;
    const corretoraToUpdate = {
      id: objCorretora.id,
      nome: objCorretora.nome,
      nomefan: objCorretora.nomefan,
      endereco: enderecoCompleto,
      cidade: objCorretora.cidade,
      estado: objCorretora.estado,
      cnpj: objCorretora.cnpj,
      email: objCorretora.email,
      telefone: objCorretora.telefone,
      susep: objCorretora.susep,
      impCorretora: objCorretora.impCorretora
    };

    fetch(`http://82.29.59.62:9090/corretora/update/${objCorretora.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(corretoraToUpdate),
    })
      .then(() => {
        toast.success("Corretora atualizada com sucesso!");
        fetchCorretoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar a corretora:", error);
        toast.error(error.message || "Erro ao atualizar a corretora");
      });
  };

  const excluir = () => {
    if (!objCorretora.id) {
      toast.warning("Selecione uma corretora para excluir.");
      return;
    }

    fetch(`http://82.29.59.62:9090/corretora/delete/${objCorretora.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(() => {
        toast.success("Corretora excluída com sucesso!");
        fetchCorretoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir a corretora:", error);
        toast.error(error.message || "Erro ao excluir a corretora");
      });
  };

  const limparFormulario = () => {
    setCorretora(corretoraInicial);
  };

  return (
    <div className="CorretoraCad">
      <CorreCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        obj={objCorretora}
        openModal={openModal}
        atualizar={atualizar}
        excluir={excluir}
      />

      {isOpen && (
        <div className="modal">
          <CorreListTable 
            vetor={corretoras} 
            selecionar={selecionarCorretora} 
            closeModal={closeModal} 
          />
        </div>
      )}
    </div>
  );
}

export default CorretoraCad;
