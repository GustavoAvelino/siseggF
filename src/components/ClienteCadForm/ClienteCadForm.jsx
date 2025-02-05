import React, { useState, useEffect } from 'react';
import './ClienteCadForm.css';  // Ajuste se o seu CSS tiver outro nome
import InputMask from 'react-input-mask';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export const ClienteCadForm = ({
  eventoTeclado,
  salvar,
  obj,
  openModal,
  atualizar,
  excluir,
  openVeiculoModal
}) => {
  const [formValido, setFormValido] = useState(false);
  const [erroCnpjCpf, setErroCnpjCpf] = useState('');
  useEffect(() => {
    validarFormulario();
  }, [obj]);

  const validarFormulario = () => {
    if (
      obj.nome &&
      obj.nomeSocial &&
      obj.email &&
      obj.dataNascimento &&
      obj.sexo &&
      obj.estadoCivil &&
      obj.cnpjCpf &&
      obj.telefone &&
      validarCnpjCpf(obj.cnpjCpf)
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
  };

  const validarCnpjCpf = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (numero.length === 11) {
      // Validação de CPF
      if (!cpf.isValid(numero)) {
        setErroCnpjCpf('CPF inválido.');
        return false;
      }
    } else if (numero.length === 14) {
      // Validação de CNPJ
      if (!cnpj.isValid(numero)) {
        setErroCnpjCpf('CNPJ inválido.');
        return false;
      }
    } else {
      setErroCnpjCpf('');
      return false;
    }

    setErroCnpjCpf('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Se precisar, pode exibir um toast aqui, 
    // mas normalmente já chamamos "salvar" ou "atualizar" externamente
  };

  const aplicarMascaraCnpjCpf = (valor) => {
    if (valor.length === 11) {
      // CPF
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
      // CNPJ
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
  };

  const handleBlurCnpjCpf = (event) => {
    const valor = event.target.value.replace(/\D/g, '');
    const valorFormatado = aplicarMascaraCnpjCpf(valor);

    eventoTeclado({
      target: {
        name: event.target.name,
        value: valorFormatado,
      },
    });

    validarCnpjCpf(valor);
    validarFormulario();
  };

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
        <button onClick={salvar} disabled={!formValido} className={!formValido ? 'disabled-button' : ''}>
          Salvar
        </button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
        {obj.id && <button onClick={openVeiculoModal}>Veículos</button>}
      </div>

      <h1>Cliente</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-field-cliente">
          <label htmlFor="nomeCli">Nome:</label><br />
          <input
            type="text"
            id="nomeCli"
            name="nome"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            onBlur={validarFormulario}
            value={obj.nome}
            required
          />
        </div>

        <div className="input-field-cliente">
          <label htmlFor="nomeSocialCli">Nome Social:</label><br />
          <input
            type="text"
            id="nomeSocialCli"
            name="nomeSocial"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            onBlur={validarFormulario}
            value={obj.nomeSocial}
            required
          />
        </div>

        <div className="input-field-cliente">
          <label htmlFor="emailCli">Email:</label><br />
          <input
            type="email"
            id="emailCli"
            name="email"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            onBlur={validarFormulario}
            value={obj.email}
            required
          />
        </div>

        <div className="row-cliente">
          <div className="input-field-cliente">
            <label htmlFor="dataNascimentoCli">Data de Nascimento:</label><br />
            <input
              type="date"
              id="dataNascimentoCli"
              name="dataNascimento"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              onBlur={validarFormulario}
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
              onBlur={validarFormulario}
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
              onBlur={validarFormulario}
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
            {erroCnpjCpf && <span className="erro-texto">{erroCnpjCpf}</span>}
          </div>

          <div className="input-field-cliente">
            <label htmlFor="telefoneCli">Telefone:</label><br />
            <InputMask
              mask="(99) 99999-9999"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              onBlur={validarFormulario}
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
