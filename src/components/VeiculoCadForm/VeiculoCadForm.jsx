import React, { useEffect } from 'react';
import styles from './VeiculoCadForm.css'; // Ajuste se tiver CSS

export const VeiculoCadForm = ({ eventoTeclado, veiculo }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // O salvamento e atualização ocorrem no componente pai
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita o comportamento padrão de submit
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  // Foca no primeiro campo automaticamente ao carregar o formulário
  useEffect(() => {
    const firstInput = document.querySelector('.form-veiculo input');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  

  return (
    <form onSubmit={handleSubmit} className="form-veiculo">
      <div className="form-veiculo-grid">
        <div className="veiinput-field">
          <label htmlFor="placa">Placa:</label>
          <input
            type="text"
            id="placa"
            name="placa"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.placa}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="codigoFipe">Código Fipe:</label>
          <input
            type="text"
            id="codigoFipe"
            name="codigoFipe"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.codigoFipe}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.marca}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.modelo}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="anoModelo">Ano Modelo:</label>
          <input
            type="number"
            id="anoModelo"
            name="anoModelo"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.anoModelo}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="anoFabricacao">Ano Fabricação:</label>
          <input
            type="number"
            id="anoFabricacao"
            name="anoFabricacao"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.anoFabricacao}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="valorFipe">Valor Fipe:</label>
          <input
            type="number"
            id="valorFipe"
            name="valorFipe"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.valorFipe}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="combustivel">Combustível:</label>
          <input
            type="text"
            id="combustivel"
            name="combustivel"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.combustivel}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="chassi">Chassi:</label>
          <input
            type="text"
            id="chassi"
            name="chassi"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.chassi}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="passageiros">Passageiros:</label>
          <input
            type="number"
            id="passageiros"
            name="passageiros"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.passageiros}
            required
          />
        </div>

        <div className="veiinput-field">
          <label htmlFor="financiado">Financiado:</label>
          <select
            id="financiado"
            name="financiado"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.financiado}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="veiinput-field">
          <label htmlFor="chassiRemarcado">Chassi Remarcado:</label>
          <select
            id="chassiRemarcado"
            name="chassiRemarcado"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.chassiRemarcado}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="veiinput-field">
          <label htmlFor="kitGas">Kit Gás:</label>
          <select
            id="kitGas"
            name="kitGas"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.kitGas}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="veiinput-field">
          <label htmlFor="plotadoOuAdesivado">Plotado/Adesivado:</label>
          <select
            id="plotadoOuAdesivado"
            name="plotadoOuAdesivado"
            onChange={eventoTeclado}
            onKeyDown={handleKeyDown}
            value={veiculo.plotadoOuAdesivado}
          >
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default VeiculoCadForm;
