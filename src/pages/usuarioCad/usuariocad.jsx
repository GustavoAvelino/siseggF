import React, { useState, useEffect } from 'react';
import UsuarioCadForm from './../../components/UsuarioCadForm/UsuarioCadForm';
import UsuarioListTable from './../../components/usuarioList/usuarioList';  // Import da tabela
// Ajuste o caminho acima caso seja diferente no seu projeto

function UsuarioCad() {
  // Objeto inicial do usuario
  const usuarioInicial = {
    id: '',
    nomeCom: '',
    email: '',
    senha: '',
    confSenha: '',
    role: '',
    corretoraId: '' // <-- Adicionamos para vincular a corretora
  };

  const [objUsuario, setUsuario] = useState(usuarioInicial);
  const [usuarios, setUsuarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Ao montar, busca usuários já filtrando pela corretora do logado
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Função para buscar todos os usuários (filtrando pela corretora do usuário logado)
  const fetchUsuarios = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    // Monta a URL de pesquisa incluindo corretoraId
    const url = `http://localhost:8080/usuario/search?corretoraId=${userCorretoraId}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          // se vier 404, retorna lista vazia
          return [];
        }
        return response.json();
      })
      .then(data => setUsuarios(data))
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  };

  // Função para lidar com a digitação nos campos
  const digitar = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...objUsuario, [name]: value });
  };

  // Abre o modal e atualiza a lista de usuários
  const openModal = () => {
    fetchUsuarios();
    setIsOpen(true);
  };

  // Seleciona um usuário
  const selecionarUsuario = (id) => {
    const usuarioSelecionado = usuarios.find((usuario) => usuario.id === id);
    setUsuario(usuarioSelecionado);
    setIsOpen(false); // Fecha o modal
  };

  // Salvar um novo usuário
  const salvar = () => {
    // 1) Pega a corretora do usuário logado
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    // 2) Monta objeto com corretora
    const usuarioParaSalvar = {
      ...objUsuario,
      corretoraId: userCorretoraId
    };

    fetch('http://localhost:8080/usuario/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(usuarioParaSalvar),
    })
      .then(() => {
        fetchUsuarios();
      })
      .then(() => {
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao salvar o usuário:", error);
      });
  };

  // Atualizar usuário
  const atualizar = () => {
    if (!objUsuario.id) {
      alert("Selecione um usuário para editar.");
      return;
    }

    // 1) Pega a corretora do usuário logado
    const userCorretoraId = localStorage.getItem('corretoraId') || '';

    // 2) Monta objeto para atualizar
    const usuarioParaAtualizar = {
      ...objUsuario,
      corretoraId: userCorretoraId
    };

    fetch(`http://localhost:8080/usuario/update/${objUsuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(usuarioParaAtualizar),
    })
      .then(() => {
        fetchUsuarios();
      })
      .then(() => {
        alert("Usuário atualizado com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao atualizar o usuário:", error);
      });
  };

  // Excluir usuário
  const excluir = () => {
    if (!objUsuario.id) {
      alert("Selecione um usuário para excluir.");
      return;
    }

    fetch(`http://localhost:8080/usuario/delete/${objUsuario.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    })
      .then(() => {
        fetchUsuarios();
      })
      .then(() => {
        alert("Usuário excluído com sucesso!");
        limparFormulario();
      })
      .catch((error) => {
        console.error("Erro ao excluir o usuário:", error);
      });
  };

  // Limpa o formulário
  const limparFormulario = () => {
    setUsuario(usuarioInicial);
  };

  return (
    <div className="UsuarioCad">
      <UsuarioCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        obj={objUsuario}
        openModal={openModal}
        atualizar={atualizar}
        excluir={excluir}
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
