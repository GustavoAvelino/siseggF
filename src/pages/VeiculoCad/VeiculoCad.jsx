import React, { useState, useEffect } from 'react';
import VeiculoCadForm from '../../components/VeiculoCadForm/VeiculoCadForm';
import VeiculoListTable from '../../components/VeiculoList/VeiculoList';
import './VeiculosCad.css';

function VeiculoCad({ cliente, closeModal }) {
  const veiculoInicial = {
    id: '',
    placa: '',
    codigoFipe: '',
    marca: '',
    modelo: '',
    anoModelo: '',
    anoFabricacao: '',
    valorFipe: '',
    combustivel: '',
    chassi: '',
    passageiros: '',
    financiado: 'false',
    chassiRemarcado: 'false',
    kitGas: 'false',
    plotadoOuAdesivado: 'false',
    clienteId: cliente?.id || ''
  };

  const [veiculo, setVeiculo] = useState(veiculoInicial);
  const [veiculos, setVeiculos] = useState([]);
  const [isOpenVeiculoList, setIsOpenVeiculoList] = useState(false);

  useEffect(() => {
    if (cliente && cliente.id) {
      fetchVeiculos(cliente.id);
    }
  }, [cliente]);

  const fetchVeiculos = (clienteId) => {
    fetch(`http://localhost:8080/veiculo/search?clienteId=${clienteId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar veículos');
        }
        return response.json();
      })
      .then((data) => {
        setVeiculos(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar veículos:', error);
      });
  };

  const handleEventoTeclado = (e) => {
    const { name, value } = e.target;
    setVeiculo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const salvar = () => {
    const payload = {
      ...veiculo,
      financiado: veiculo.financiado === 'true',
      chassiRemarcado: veiculo.chassiRemarcado === 'true',
      kitGas: veiculo.kitGas === 'true',
      plotadoOuAdesivado: veiculo.plotadoOuAdesivado === 'true',
    };

    console.log('Payload enviado para salvar:', payload);

    fetch('http://localhost:8080/veiculo/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao salvar veículo');
        }
        alert('Veículo salvo com sucesso!');
        if (cliente && cliente.id) fetchVeiculos(cliente.id);
        limparFormulario();
      })
      .catch((error) => console.error('Erro ao salvar veículo:', error));
  };

  const atualizar = () => {
    if (!veiculo.id) {
      alert('Selecione um veículo para editar.');
      return;
    }
  
    const payload = {
      ...veiculo,
      financiado: veiculo.financiado === 'true',
      chassiRemarcado: veiculo.chassiRemarcado === 'true',
      kitGas: veiculo.kitGas === 'true',
      plotadoOuAdesivado: veiculo.plotadoOuAdesivado === 'true',
      clienteId: veiculo.clienteId // Certifique-se de enviar o clienteId
    };
  
    console.log('Payload enviado para atualizar:', payload);
  
    fetch(`http://localhost:8080/veiculo/update/${veiculo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          console.error('Erro do servidor:', error);
          throw new Error(error.message || 'Erro ao atualizar veículo');
        }
        return response.json();
      })
      .then((data) => {
        alert('Veículo atualizado com sucesso!');
        console.log('Retorno do servidor:', data);
        if (cliente && cliente.id) fetchVeiculos(cliente.id);
        limparFormulario();
      })
      .catch((error) => {
        console.error('Erro ao atualizar veículo:', error);
      });
  };

  const excluir = () => {
    if (!veiculo.id) {
      alert('Selecione um veículo para excluir.');
      return;
    }

    fetch(`http://localhost:8080/veiculo/delete/${veiculo.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao excluir veículo');
        }
        alert('Veículo excluído com sucesso!');
        setVeiculos((prev) => prev.filter((v) => v.id !== veiculo.id));
        limparFormulario();
      })
      .catch((error) => console.error('Erro ao excluir veículo:', error));
  };

  const limparFormulario = () => {
    setVeiculo({ ...veiculoInicial, clienteId: cliente?.id || '' });
  };

  const openVeiculoList = () => setIsOpenVeiculoList(true);
  const closeVeiculoList = () => setIsOpenVeiculoList(false);

const selecionarVeiculo = (id) => {
  const veiculoSelecionado = veiculos.find((v) => v.id === id);
  if (veiculoSelecionado) {
    setVeiculo({
      ...veiculoSelecionado,
      financiado: veiculoSelecionado.financiado ? 'true' : 'false',
      chassiRemarcado: veiculoSelecionado.chassiRemarcado ? 'true' : 'false',
      kitGas: veiculoSelecionado.kitGas ? 'true' : 'false',
      plotadoOuAdesivado: veiculoSelecionado.plotadoOuAdesivado ? 'true' : 'false',
      clienteId: veiculoSelecionado.cliente?.id || '' // Ajuste para usar apenas o ID do cliente
    });
  }
  closeVeiculoList();
};


  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="botoes">
          <button onClick={salvar}>Salvar</button>
          {veiculo.id && <button onClick={atualizar}>Editar</button>}
          {veiculo.id && <button onClick={excluir}>Excluir</button>}
          <button onClick={openVeiculoList}>Consultar</button>
          {!veiculo.id && <button onClick={limparFormulario}>Limpar</button>}
        </div>
        <button id="closeveiculos" onClick={closeModal}>X</button>
        <h1 id="title-veiculo">Cadastro de Veículo</h1>

        <VeiculoCadForm eventoTeclado={handleEventoTeclado} veiculo={veiculo} />

        {isOpenVeiculoList && (
          <VeiculoListTable
            vetor={veiculos}
            selecionar={selecionarVeiculo}
            closeModal={closeVeiculoList}
            clienteId={cliente?.id}
          />
        )}
      </div>
    </div>
  );
}

export default VeiculoCad;
