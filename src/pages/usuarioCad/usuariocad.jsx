import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsuarioCadForm from './../../components/UsuarioCadForm/UsuarioCadForm';
import UsuarioListTable from './../../components/usuarioList/usuarioList';

function UsuarioCad() {
  // Objeto inicial (quando não há usuário selecionado)
  const usuarioInicial = {
    id: '',
    nomeCom: '',
    email: '',
    senha: '',       // Campo de senha digitada (nunca exibe o hash)
    confSenha: '',   // Campo de confirmação de senha (se necessário)
    role: '',
    corretoraId: ''
  };

  const [objUsuario, setUsuario] = useState(usuarioInicial);
  const [usuarios, setUsuarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Carrega a lista de usuários ao montar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Busca todos os usuários da corretora logada
  const fetchUsuarios = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    fetch(`http://82.29.59.62:9090/usuario/search?corretoraId=${userCorretoraId}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao buscar usuários");
        }
        return response.json();
      })
      .then((data) => setUsuarios(data))
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        toast.error(error.message || "Erro ao buscar usuários");
      });
  };

  // Atualiza o estado de objUsuario quando o usuário digita nos inputs
  const digitar = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...objUsuario, [name]: value });
  };

  // Abre o modal para listar e selecionar usuários
  const openModal = () => {
    // Atualiza a lista antes de abrir o modal, se desejar
    fetchUsuarios();
    setIsOpen(true);
  };

  // Seleciona um usuário para edição
  const selecionarUsuario = (id) => {
    const usuarioSelecionado = usuarios.find((u) => u.id === id);
    if (!usuarioSelecionado) return;

    // Importante: não atribuir a senha do back-end diretamente ao campo "senha".
    // Se vier no objeto, zere para evitar sobrescrever a senha com hash.
    const usuarioEdit = {
      ...usuarioSelecionado,
      senha: '',      // Mantém vazio para não sobrescrever
      confSenha: ''   // Se houver confirmação
    };

    setUsuario(usuarioEdit);
    setIsOpen(false);
  };

  // Salva (cria) usuário
  const salvar = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    const usuarioParaSalvar = {
      ...objUsuario,
      corretoraId: userCorretoraId
    };

    fetch('http://82.29.59.62:9090/usuario/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(usuarioParaSalvar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao salvar usuário");
        }
        return response.text();  
      })
      .then((message) => {
        toast.success(message || "Usuário salvo com sucesso!");
        fetchUsuarios();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar o usuário:", error);
        toast.error(error.message || "Erro ao salvar o usuário");
      });
  };

  // Atualiza usuário
  const atualizar = () => {
    if (!objUsuario.id) {
      toast.warning("Selecione um usuário para editar.");
      return;
    }

    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    const usuarioParaAtualizar = {
      ...objUsuario,
      corretoraId: userCorretoraId
    };

    fetch(`http://82.29.59.62:9090/usuario/update/${objUsuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(usuarioParaAtualizar),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao atualizar usuário");
        }
        return response.text();
      })
      .then((message) => {
        toast.success(message || "Usuário atualizado com sucesso!");
        fetchUsuarios();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar o usuário:", error);
        toast.error(error.message || "Erro ao atualizar o usuário");
      });
  };

  // Exclui usuário
  const excluir = () => {
    if (!objUsuario.id) {
      toast.warning("Selecione um usuário para excluir.");
      return;
    }

    fetch(`http://82.29.59.62:9090/usuario/delete/${objUsuario.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Erro ao excluir usuário");
        }
        return response.text();
      })
      .then((message) => {
        toast.success(message || "Usuário excluído com sucesso!");
        fetchUsuarios();
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir o usuário:", error);
        toast.error(error.message || "Erro ao excluir o usuário");
      });
  };

  // Limpa o formulário (volta ao estado inicial)
  const limparFormulario = () => {
    setUsuario(usuarioInicial);
  };

  return (
    <div className="UsuarioCad">
      <UsuarioCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        atualizar={atualizar}
        excluir={excluir}
        obj={objUsuario}
        openModal={openModal}
      />

      {isOpen && (
        <div className="modal">
          <UsuarioListTable
            vetor={usuarios}
            selecionar={selecionarUsuario}
            closeModal={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default UsuarioCad;
