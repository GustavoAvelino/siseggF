import React from 'react';
import './ClienteCadForm.css';
import InputMask from 'react-input-mask';

export const ClienteCadForm = ({ eventoTeclado, salvar, obj, openModal, atualizar, excluir, openVeiculoModal }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Envio de formulário de cliente.");
  };

  // Função para aplicar a máscara de CNPJ ou CPF
  const aplicarMascaraCnpjCpf = (valor) => {
    if (valor.length === 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
  };

  

  // Evento ao pressionar Enter ou ao perder o foco no campo CNPJ/CPF
  const handleBlurCnpjCpf = (event) => {
    const valor = event.target.value.replace(/\D/g, '');
    const valorFormatado = aplicarMascaraCnpjCpf(valor);

    eventoTeclado({
      target: {
        name: event.target.name,
        value: valorFormatado,
      },
    });
  };

  // Evento ao pressionar Enter ou ao perder o foco no campo Telefone
  

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <div className="container-cliente">
      <div className="botoes-cliente">
        <button onClick={salvar}>Salvar</button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
        {obj.id && <button onClick={openVeiculoModal}>Veículos</button>}
      </div>
      <h1>Cliente</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo: Nome */}
        <div className="input-field-cliente">
          <label htmlFor="nomeCli">Nome:</label><br />
          <input
            type="text"
            id="nomeCli"
            name="nome"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.nome}
            required
          />
        </div>

        {/* Campo: Nome Social */}
        <div className="input-field-cliente">
          <label htmlFor="nomeSocialCli">Nome Social:</label><br />
          <input
            type="text"
            id="nomeSocialCli"
            name="nomeSocial"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.nomeSocial}
            required
          />
        </div>

        {/* Campo: Email */}
        <div className="input-field-cliente">
          <label htmlFor="emailCli">Email:</label><br />
          <input
            type="email"
            id="emailCli"
            name="email"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.email}
            required
          />
        </div>

        {/* Linha com Data de Nascimento, Sexo e Estado Civil */}
        <div className="row-cliente">
          <div className="input-field-cliente">
            <label htmlFor="dataNascimentoCli">Data de Nascimento:</label><br />
            <input
              type="date"
              id="dataNascimentoCli"
              name="dataNascimento"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.dataNascimento}
              required
            />
          </div>

          <div className="input-field-cliente">
            <label htmlFor="sexoCli">Sexo:</label><br />
            <select
              id="sexoCli"
              name="sexo"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.sexo}
              required
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="input-field-cliente">
            <label htmlFor="estadoCivilCli">Estado Civil:</label><br />
            <select
              id="estadoCivilCli"
              name="estadoCivil"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.estadoCivil}
              required
            >
              <option value="">Selecione</option>
              <option value="Solteiro">Solteiro</option>
              <option value="Casado">Casado</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Viúvo">Viúvo</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        {/* Linha com CNPJ/CPF e Telefone */}
        <div className="row-cliente">
          <div className="input-field-cliente">
            <label htmlFor="cnpjCpfCli">CNPJ/CPF:</label><br />
            <input
              type="text"
              id="cnpjCpfCli"
              name="cnpjCpf"
              onKeyDown={handleKeyDown}
              onBlur={handleBlurCnpjCpf}
              onChange={eventoTeclado}
              value={obj.cnpjCpf}
              required
            />
          </div>

          <div className="input-field-cliente">
            <label htmlFor="telefoneCli">Telefone:</label><br />
            <InputMask
              mask="(99) 99999-9999"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.telefone}
            >
              {(inputProps) => (
                  <input
                  {...inputProps}
                  type="text"
                  id="telefoneCli"
                  name="telefone"
                  required
                   />
                 )}
              </InputMask>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClienteCadForm;
