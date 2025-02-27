import React, { useState, useEffect } from 'react';
import ProdutorCadForm from './../../components/ProdutorCadForm/ProdutorCadForm';
import ProdutorList from './../../components/ProdutorList/ProdutorList';
import './ProdutorCad.css';
import { toast } from 'react-toastify';

function ProdutorCad() {
  const produtorInicial = {
    id: '',
    nome: '',
    cpf: '',
    cnpj: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    endereco: '',
    imposto: '',
    repasse: '',
    repasseSobre: '',
    formaRepasse: '',
    corretoraId: '' 
  };

  const [objProdutor, setProdutor] = useState(produtorInicial);
  const [produtores, setProdutores] = useState([]);
  const [isOpenProdutorModal, setIsOpenProdutorModal] = useState(false);

  useEffect(() => {
    fetchProdutores();
  }, []);

  const fetchProdutores = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    const url = `http://82.29.59.62:9090/produtor/search?corretoraId=${userCorretoraId}`
    fetch(url)
      .then(async response => {
        if (!response.ok) {
          const errorMessage = await response.text();
          setProdutores([]);
          toast.error(errorMessage || 'Erro ao buscar produtores');
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setProdutores(data);
        }
      })
      .catch(() => {
        toast.error('Erro inesperado ao buscar produtores');
      });
  };

  const digitar = (e) => {
    const { name, value } = e.target;
    setProdutor({ ...objProdutor, [name]: value });
  };

  const salvar = () => {
    const userCorretoraId = localStorage.getItem('corretoraId') || '';
    const produtorParaSalvar = { ...objProdutor, corretoraId: userCorretoraId };

    fetch('http://82.29.59.62:9090/produtor/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtorParaSalvar), // Alterado para enviar a corretora correta
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar produtor');
        return response.text();
    })
    .then(() => {
        toast.success('Produtor salvo com sucesso!');
        fetchProdutores();
        setProdutor(produtorInicial);
    })
    .catch(() => {
        toast.error('Erro ao salvar produtor');
    });
};


  const atualizar = () => {
    fetch(`http://82.29.59.62:9090/produtor/update/${objProdutor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objProdutor),
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar produtor');
        return response.text();
      })
      .then(() => {
        toast.success('Produtor atualizado com sucesso!');
        fetchProdutores();
        setProdutor(produtorInicial);
      })
      .catch(() => {
        toast.error('Erro ao atualizar produtor');
      });
  };

  const excluir = () => {
    fetch(`http://82.29.59.62:9090/produtor/delete/${objProdutor.id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao excluir produtor');
        return response.text();
      })
      .then(() => {
        toast.success('Produtor excluído com sucesso!');
        fetchProdutores();
        setProdutor(produtorInicial);
      })
      .catch(() => {
        toast.error('Erro ao excluir produtor');
      });
  };

  const selecionarProdutor = (id) => {
    const produtorSelecionado = produtores.find((p) => p.id === id);
    if (produtorSelecionado) {
      setProdutor(produtorSelecionado);
      setIsOpenProdutorModal(false); // Fecha o modal ao selecionar
    }
  };

  return (
    <div className="ProdutorCad">
      <ProdutorCadForm
        eventoTeclado={digitar}
        salvar={salvar}
        obj={objProdutor}
        atualizar={atualizar}
        excluir={excluir}
        openModal={() => setIsOpenProdutorModal(true)}
      />

      {isOpenProdutorModal && (
        <ProdutorList
          vetor={produtores}
          selecionar={selecionarProdutor}
          closeModal={() => setIsOpenProdutorModal(false)}
        />
      )}
    </div>
  );
}

export default ProdutorCad;
