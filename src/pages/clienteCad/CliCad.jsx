import React, { useState, useEffect } from 'react';
import ClienteCadForm from './../../components/ClienteCadForm/ClienteCadForm';
import ClienteList from './../../components/ClienteList/ClienteList';
import VeiculoCad from './../VeiculoCad/VeiculoCad';
import './CliCad.css'; // Se tiver um CSS específico para esta página
import { toast } from 'react-toastify';

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
      .then(async response => {
        if (!response.ok) {
          // Se for 404 ou outro status de erro, podemos lidar aqui
          const errorMessage = await response.text();
          console.error('Erro ao buscar clientes:', errorMessage);
          setClientes([]); // Zera a lista se deu erro
          toast.error(errorMessage || 'Erro ao buscar clientes');
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          console.log('Clientes obtidos:', data);
          setClientes(data);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Erro inesperado ao buscar clientes');
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
      toast.warning('Por favor, selecione um cliente primeiro.');
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

    const clienteParaSalvar = { ...objCliente, corretoraId: userCorretoraId };

    fetch('http://localhost:8080/cliente/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(clienteParaSalvar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 400) {
            toast.error(errorMessage || 'Dados inválidos ao cadastrar cliente.');
          } else {
            toast.error(errorMessage || 'Erro ao salvar o cliente.');
          }
          return;
        }
        // Sucesso
        toast.success('Cliente salvo com sucesso!');
        fetchClientes();
        limparFormulario();
      })
      .catch(error => {
        console.error('Erro ao salvar o cliente:', error);
        toast.error('Erro inesperado ao salvar o cliente');
      });
  };

  // Atualizar cliente existente
  const atualizar = () => {
    if (!objCliente.id) {
      toast.warning('Selecione um cliente para editar.');
      return;
    }

    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    const clienteParaSalvar = { ...objCliente, corretoraId: userCorretoraId };

    fetch(`http://localhost:8080/cliente/update/${objCliente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(clienteParaSalvar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 404) {
            toast.error(errorMessage || 'Cliente não encontrado.');
          } else {
            toast.error(errorMessage || 'Erro ao atualizar o cliente.');
          }
          return;
        }
        // Sucesso
        toast.success('Cliente atualizado com sucesso!');
        fetchClientes();
        limparFormulario();
      })
      .catch(error => {
        console.error('Erro ao atualizar o cliente:', error);
        toast.error('Erro inesperado ao atualizar o cliente');
      });
  };

  // Excluir cliente
  const excluir = () => {
    if (!objCliente.id) {
      toast.warning('Selecione um cliente para excluir.');
      return;
    }

    fetch(`http://localhost:8080/cliente/delete/${objCliente.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          if (response.status === 409) {
            // CONFLICT -> violação de integridade
            toast.error(errorMessage || 'Não foi possível excluir o cliente. Verifique se há vínculos.');
          } else if (response.status === 404) {
            toast.error(errorMessage || 'Cliente não encontrado.');
          } else {
            toast.error(errorMessage || 'Erro ao excluir o cliente.');
          }
          return;
        }
        // Sucesso
        toast.success('Cliente excluído com sucesso!');
        fetchClientes();
        limparFormulario();
      })
      .catch(error => {
        console.error('Erro ao excluir o cliente:', error);
        toast.error('Erro inesperado ao excluir o cliente');
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
