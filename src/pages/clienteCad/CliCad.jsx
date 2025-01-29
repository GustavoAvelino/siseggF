import React, { useState, useEffect } from 'react';
import ClienteCadForm from './../../components/ClienteCadForm/ClienteCadForm';
import ClienteList from './../../components/ClienteList/ClienteList';
import VeiculoCad from './../VeiculoCad/VeiculoCad';

function ClienteCad() {
  const clienteInicial = {
    id: '',
    cnpjCpf: '',
    nome: '',
    nomeSocial: '',
    sexo: '',
    dataNascimento: '',
    estadoCivil: '',
    email: '',
    telefone: ''
  };

  const [objCliente, setCliente] = useState(clienteInicial);
  const [clientes, setClientes] = useState([]);
  const [isOpenClienteModal, setIsOpenClienteModal] = useState(false);
  const [isOpenVeiculoModal, setIsOpenVeiculoModal] = useState(false);

  // Buscar todos os clientes
  const fetchClientes = () => {
    fetch('http://localhost:8080/cliente')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch((error) => {
        console.error("Erro ao buscar clientes:", error);
      });
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Lidar com a digitação nos campos
  const digitar = (e) => {
    const { name, value } = e.target;
    setCliente({ ...objCliente, [name]: value });
  };

  // Abrir e fechar modal de consulta de clientes
  const openClienteModal = () => setIsOpenClienteModal(true);
  const closeClienteModal = () => setIsOpenClienteModal(false);

  // Abrir e fechar modal de veículos
  const openVeiculoModal = () => {
    if (objCliente.id) {
      // Só abre o modal se tiver um cliente selecionado
      setIsOpenVeiculoModal(true);
    } else {
      alert("Por favor, selecione um cliente primeiro.");
    }
  };
  const closeVeiculoModal = () => {
    setIsOpenVeiculoModal(false);
  };

  // Selecionar um cliente na lista
  const selecionarCliente = (id) => {
    const clienteSelecionado = clientes.find((c) => c.id === id);
    setCliente(clienteSelecionado);
    closeClienteModal(); 
  };

  // Salvar novo cliente
  const salvar = () => {
    fetch('http://localhost:8080/cliente/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objCliente),
    })
      .then(() => {
        fetchClientes();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar o cliente:", error);
      });
  };

  // Atualizar cliente existente
  const atualizar = () => {
    if (!objCliente.id) {
      alert("Selecione um cliente para editar.");
      return;
    }
    fetch(`http://localhost:8080/cliente/update/${objCliente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objCliente),
    })
      .then(() => {
        fetchClientes();
        alert("Cliente atualizado com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar o cliente:", error);
      });
  };

  // Excluir cliente
  const excluir = () => {
    if (!objCliente.id) {
      alert("Selecione um cliente para excluir.");
      return;
    }
    fetch(`http://localhost:8080/cliente/delete/${objCliente.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(() => {
        fetchClientes();
        alert("Cliente excluído com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir o cliente:", error);
      });
  };

  // Limpar formulário
  const limparFormulario = () => {
    setCliente(clienteInicial);
  };

  return (
    <div className="ClienteCad">
      <ClienteCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        obj={objCliente}
        openModal={openClienteModal}
        atualizar={atualizar}
        excluir={excluir}
        openVeiculoModal={openVeiculoModal}
      />

      {isOpenClienteModal && (
        <ClienteList
          vetor={clientes}
          selecionar={selecionarCliente}
          closeModal={closeClienteModal}
        />
      )}

      {isOpenVeiculoModal && (
        <VeiculoCad
          cliente={objCliente}
          closeModal={closeVeiculoModal}
        />
      )}
    </div>
  );
}

export default ClienteCad;
