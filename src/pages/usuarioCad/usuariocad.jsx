import React, { useState, useEffect } from 'react';
import UsuarioCadForm from './../../components/UsuarioCadForm/UsuarioCadForm';
import UsuarioListTable from './../../components/usuarioList/usuarioList';  // Importando a tabela de usuários

function UsuarioCad() {

  const usuario = {
    id: '',
    nomeCom: '',
    email: '',
    senha: '',
    confSenha: '',
    role: ''
  };

  const [objUsuario, setUsuario] = useState(usuario);
  const [usuarios, setUsuarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Função para buscar todos os usuários
  const fetchUsuarios = () => {
    fetch('http://localhost:8080/usuario')
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  };

  // Chama a função de buscar usuários assim que o componente for montado
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Função para lidar com a digitação nos campos
  const digitar = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...objUsuario, [name]: value });
  };

  // Função para abrir o modal e atualizar a lista de usuários
  const openModal = () => {
    fetchUsuarios();
    setIsOpen(true);
  };

  // Função para selecionar um usuário
  const selecionarUsuario = (id) => {
    const usuarioSelecionado = usuarios.find((usuario) => usuario.id === id);
    setUsuario(usuarioSelecionado);
    setIsOpen(false); // Fechar o modal
  };

  // Função para salvar um novo usuário
  const salvar = () => {
    fetch('http://localhost:8080/usuario/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objUsuario),
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

  // Função para atualizar os dados de um usuário
  const atualizar = () => {
    if (!objUsuario.id) {
      alert("Selecione um usuário para editar.");
      return;
    }

    fetch(`http://localhost:8080/usuario/update/${objUsuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(objUsuario),
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

  // Função para excluir um usuário
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

  // Função de limpeza do formulário
  const limparFormulario = () => {
    setUsuario({
      id: '',
      nomeCom: '',
      email: '',
      senha: '',
      confSenha: '',
      role: ''
    });
  };

  return (
    <div className="UsuarioCad">
      <UsuarioCadForm eventoTeclado={digitar} salvar={salvar} obj={objUsuario} openModal={openModal} atualizar={atualizar} excluir={excluir} />

      {isOpen && (
        <div className="modal">
          <UsuarioListTable vetor={usuarios} selecionar={selecionarUsuario} closeModal={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default UsuarioCad;
