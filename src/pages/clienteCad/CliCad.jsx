import React, { useState, useEffect } from 'react';
import ClienteCadForm from './../../components/ClienteCadForm/ClienteCadForm';
import ClienteList from './../../components/ClienteList/ClienteList';
import VeiculoCad from './../VeiculoCad/VeiculoCad';
import './CliCad.css'; // Se tiver um CSS específico para esta página

function ClienteCad() {
  // Objeto inicial do cliente
  const clienteInicial = {
    id: '',
    cnpjCpf: '',
    nome: '',
    nomeSocial: '',
    sexo: '',
    dataNascimento: '',
    estadoCivil: '',
    email: '',
    telefone: '',
    corretoraId: '' // Vincula à corretora do usuário
  };

  const [objCliente, setCliente] = useState(clienteInicial);
  const [clientes, setClientes] = useState([]);

  // Controle de modais
  const [isOpenClienteModal, setIsOpenClienteModal] = useState(false);
  const [isOpenVeiculoModal, setIsOpenVeiculoModal] = useState(false);

  // Ao montar, busca clientes apenas da corretora do usuário
  useEffect(() => {
    fetchClientes();
  }, []);

  // Busca clientes filtrando pela corretoraId do usuário logado
  const fetchClientes = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    console.log('Buscando clientes da corretora:', userCorretoraId);

    const url = `http://localhost:8080/cliente/search?corretoraId=${userCorretoraId}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          // Se vier 404, retorna lista vazia
          return [];
        }
        return response.json();
      })
      .then(data => {
        console.log('Clientes obtidos:', data);
        setClientes(data);
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  };

  // Atualiza estado ao digitar
  const digitar = (e) => {
    const { name, value } = e.target;
    setCliente({ ...objCliente, [name]: value });
  };

  // Modal de listagem de clientes
  const openClienteModal = () => setIsOpenClienteModal(true);
  const closeClienteModal = () => setIsOpenClienteModal(false);

  // Modal de veículos
  const openVeiculoModal = () => {
    if (objCliente.id) {
      setIsOpenVeiculoModal(true);
    } else {
      alert('Por favor, selecione um cliente primeiro.');
    }
  };
  const closeVeiculoModal = () => {
    setIsOpenVeiculoModal(false);
  };

  // Selecionar um cliente da lista
  const selecionarCliente = (id) => {
    const clienteSelecionado = clientes.find((c) => c.id === id);
    setCliente(clienteSelecionado);
    closeClienteModal();
  };

  // Salvar novo cliente
  const salvar = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    console.log('Salvando com corretoraId:', userCorretoraId);

    // Copia objCliente e define a corretora
    const clienteParaSalvar = { ...objCliente, corretoraId: userCorretoraId };
    console.log('Cliente para salvar:', clienteParaSalvar);

    fetch('http://localhost:8080/cliente/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(clienteParaSalvar),
    })
      .then(() => {
        // Recarrega a lista e limpa o form
        fetchClientes();
        limparFormulario();
      })
      .catch(error => console.error('Erro ao salvar o cliente:', error));
  };

  // Atualizar cliente existente
  const atualizar = () => {
    if (!objCliente.id) {
      alert('Selecione um cliente para editar.');
      return;
    }

    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    const clienteParaSalvar = { ...objCliente, corretoraId: userCorretoraId };
    console.log('Atualizando cliente:', clienteParaSalvar);

    fetch(`http://localhost:8080/cliente/update/${objCliente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(clienteParaSalvar),
    })
      .then(() => {
        // Recarrega a lista e limpa o form
        fetchClientes();
        alert('Cliente atualizado com sucesso!');
        limparFormulario();
      })
      .catch(error => console.error('Erro ao atualizar o cliente:', error));
  };

  // Excluir cliente
  const excluir = () => {
    if (!objCliente.id) {
      alert('Selecione um cliente para excluir.');
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
        // Recarrega a lista e limpa o form
        fetchClientes();
        alert('Cliente excluído com sucesso!');
        limparFormulario();
      })
      .catch(error => console.error('Erro ao excluir o cliente:', error));
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

      {/* Modal de listagem de clientes */}
      {isOpenClienteModal && (
        <ClienteList
          vetor={clientes}
          selecionar={selecionarCliente}
          closeModal={closeClienteModal}
        />
      )}

      {/* Modal de veículos, se necessário */}
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
