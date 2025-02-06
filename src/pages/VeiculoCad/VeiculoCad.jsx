import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  // Novo state de loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cliente && cliente.id) {
      fetchVeiculos(cliente.id);
    }
  }, [cliente]);

  const fetchVeiculos = (clienteId) => {
    setLoading(true);
    fetch(`http://localhost:8080/veiculo/search?clienteId=${clienteId}`)
      .then(async (response) => {
        setLoading(false);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Erro ao buscar veículos');
        }
        return response.json();
      })
      .then((data) => {
        setVeiculos(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar veículos:', error);
        toast.error(error.message || 'Erro ao buscar veículos');
      });
  };

  // -----------------------------------------------------
  // BUSCA OS DADOS AUTOMATICAMENTE AO DIGITAR A PLACA
  // -----------------------------------------------------
  const consultarPlaca = (placaValue) => {
    if (!placaValue) return;
    setLoading(true);
    const url = `http://localhost:8080/veiculo/consulta-placa-detalhada/${placaValue}`;

    fetch(url)
      .then(async (res) => {
        setLoading(false);
        if (!res.ok) {
          const msgErro = await res.text();
          throw new Error(msgErro || 'Erro ao consultar placa');
        }
        return res.json(); // Este deve retornar o DTO com dados
      })
      .then((data) => {
        // Ajustar conforme PlacaResponseDTO
        setVeiculo((prev) => ({
          ...prev,
          placa: data.placa || '',
          codigoFipe: data.codigoFipe || '',
          marca: data.marca || '',
          modelo: data.modelo || '',
          anoModelo: data.anoModelo || '',
          anoFabricacao: data.ano || '', // Se a API retornou "ano" como ano de fabricação
          valorFipe: data.valorFipe || '',
          combustivel: data.combustivel || '',
          chassi: data.chassiCompleto || '', 
          passageiros: data.passageiros || '',
        }));

        toast.success('Dados da placa carregados com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao consultar placa:', error);
        toast.error(error.message || 'Erro ao consultar placa');
      });
  };

  // Captura evento de teclado no form
  const handleEventoTeclado = (e) => {
    const { name, value } = e.target;
    setVeiculo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------------------
  // SALVAR
  // -----------------------------------------------------
  const salvar = () => {
    setLoading(true);
    const payload = {
      ...veiculo,
      financiado: veiculo.financiado === 'true',
      chassiRemarcado: veiculo.chassiRemarcado === 'true',
      kitGas: veiculo.kitGas === 'true',
      plotadoOuAdesivado: veiculo.plotadoOuAdesivado === 'true',
    };

    fetch('http://localhost:8080/veiculo/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        setLoading(false);
        // Evite chamar .json() aqui, pois pode não haver body
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Erro ao salvar veículo');
        }
        // Se chegar aqui, deu tudo certo
        toast.success('Veículo salvo com sucesso!');
        if (cliente && cliente.id) fetchVeiculos(cliente.id);
        limparFormulario();
      })
      .catch((error) => {
        console.error('Erro ao salvar veículo:', error);
        toast.error(error.message || 'Erro ao salvar veículo');
      });
  };

  // -----------------------------------------------------
  // ATUALIZAR
  // -----------------------------------------------------
  const atualizar = () => {
    if (!veiculo.id) {
      toast.warning('Selecione um veículo para editar.');
      return;
    }

    setLoading(true);
    const payload = {
      ...veiculo,
      financiado: veiculo.financiado === 'true',
      chassiRemarcado: veiculo.chassiRemarcado === 'true',
      kitGas: veiculo.kitGas === 'true',
      plotadoOuAdesivado: veiculo.plotadoOuAdesivado === 'true',
      clienteId: veiculo.clienteId,
    };

    fetch(`http://localhost:8080/veiculo/update/${veiculo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        setLoading(false);
        // Possível que seu endpoint PUT não retorne JSON 
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Erro ao atualizar veículo');
        }
        toast.success('Veículo atualizado com sucesso!');
        if (cliente && cliente.id) fetchVeiculos(cliente.id);
        limparFormulario();
      })
      .catch((error) => {
        console.error('Erro ao atualizar veículo:', error);
        toast.error(error.message || 'Erro ao atualizar veículo');
      });
  };

  // -----------------------------------------------------
  // EXCLUIR
  // -----------------------------------------------------
  const excluir = () => {
    if (!veiculo.id) {
      toast.warning('Selecione um veículo para excluir.');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/veiculo/delete/${veiculo.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        setLoading(false);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Erro ao excluir veículo');
        }
        toast.success('Veículo excluído com sucesso!');
        setVeiculos((prev) => prev.filter((v) => v.id !== veiculo.id));
        limparFormulario();
      })
      .catch((error) => {
        console.error('Erro ao excluir veículo:', error);
        toast.error(error.message || 'Erro ao excluir veículo');
      });
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
        clienteId: veiculoSelecionado.cliente?.id || '',
      });
    }
    closeVeiculoList();
  };

  return (
    <div className="modal-container">
      {/* Se quiser um overlay extra para loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ color: '#fff' }}>Carregando...</p>
        </div>
      )}

      <div className="modal-overlay" onClick={closeModal}></div>

      <div className={`modal-content ${loading ? 'disabled-form' : ''}`}>
        <div className="botoes">
          <button onClick={salvar} disabled={loading}>Salvar</button>
          {veiculo.id && <button onClick={atualizar} disabled={loading}>Editar</button>}
          {veiculo.id && <button onClick={excluir} disabled={loading}>Excluir</button>}
          <button onClick={openVeiculoList} disabled={loading}>Consultar</button>
          {!veiculo.id && <button onClick={limparFormulario} disabled={loading}>Limpar</button>}
        </div>
        <button id="closeveiculos" onClick={closeModal} disabled={loading}>X</button>
        <h1 id="title-veiculo">Cadastro de Veículo</h1>

        <VeiculoCadForm
          eventoTeclado={handleEventoTeclado}
          veiculo={veiculo}
          onPlacaEnter={consultarPlaca}
          loading={loading} // se quiser desabilitar inputs
        />

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
