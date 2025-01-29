// CorretoraCad.js

import React, { useState, useEffect } from 'react';
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

  // Função para buscar todas as corretoras
  const fetchCorretoras = () => {
    fetch('http://localhost:8080/corretora')
      .then(response => response.json())
      .then(data => setCorretoras(data))
      .catch((error) => {
        console.error("Erro ao buscar corretoras:", error);
      });
  };

  useEffect(() => {
    fetchCorretoras();
  }, []);

  // Lida com a digitação nos campos do formulário
  const digitar = (e) => {
    const { name, value } = e.target;
    setCorretora({ ...objCorretora, [name]: value });
  };

  // Função para abrir o modal (listagem)
  const openModal = () => {
    fetchCorretoras();
    setIsOpen(true);
  };

  // Função para fechar o modal (listagem)
  const closeModal = () => {
    setIsOpen(false);
  };

  // Ao selecionar uma corretora na tabela, vamos fazer
  // o "split" do campo 'endereco' em rua, bairro e numero
  const selecionarCorretora = (id) => {
    const corretoraSelecionada = corretoras.find(
      (corretora) => corretora.id === id
    );
    if (!corretoraSelecionada) return;

    // Faz o split do endereço (assumindo que está "rua, bairro, numero")
    let rua = '', bairro = '', numero = '';
    if (corretoraSelecionada.endereco) {
      const partes = corretoraSelecionada.endereco.split(',');
      // Caso queira garantir que terá sempre 3 partes:
      if (partes.length === 3) {
        rua = partes[0].trim();
        bairro = partes[1].trim();
        numero = partes[2].trim();
      } else {
        // Lógica para tratar caso haja menos ou mais de 3 partes
        // (Ajuste conforme sua necessidade)
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

    closeModal(); // Fecha o modal
  };

  // Função para salvar (POST)
  const salvar = () => {
    // Monta o campo 'endereco' antes de enviar para o backend
    const enderecoCompleto = `${objCorretora.rua}, ${objCorretora.bairro}, ${objCorretora.numero}`;
    
    // Cria objeto apenas com os campos realmente existentes no backend
    const corretoraToSave = {
      // Se o ID estiver em branco, o backend vai criar novo
      id: objCorretora.id || null,
      nome: objCorretora.nome,
      nomefan: objCorretora.nomefan,
      endereco: enderecoCompleto,  // <- concatenado
      cidade: objCorretora.cidade,
      estado: objCorretora.estado,
      cnpj: objCorretora.cnpj,
      email: objCorretora.email,
      telefone: objCorretora.telefone,
      susep: objCorretora.susep,
      impCorretora: objCorretora.impCorretora
    };

    fetch('http://localhost:8080/corretora/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(corretoraToSave),
    })
      .then(() => {
        fetchCorretoras();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar a corretora:", error);
      });
  };

  // Função para atualizar (PUT)
  const atualizar = () => {
    if (!objCorretora.id) {
      alert("Selecione uma corretora para editar.");
      return;
    }

    const enderecoCompleto = `${objCorretora.rua}, ${objCorretora.bairro}, ${objCorretora.numero}`;
    const corretoraToUpdate = {
      // O ID é necessário no update
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

    fetch(`http://localhost:8080/corretora/update/${objCorretora.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(corretoraToUpdate),
    })
      .then(() => {
        fetchCorretoras();
        alert("Corretora atualizada com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar a corretora:", error);
      });
  };

  // Função para excluir (DELETE)
  const excluir = () => {
    if (!objCorretora.id) {
      alert("Selecione uma corretora para excluir.");
      return;
    }

    fetch(`http://localhost:8080/corretora/delete/${objCorretora.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(() => {
        fetchCorretoras();
        alert("Corretora excluída com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir a corretora:", error);
      });
  };

  // Limpar o formulário
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
            closeModal={() => setIsOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}

export default CorretoraCad;
