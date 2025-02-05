import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import './ProdutorCadForm.css';

const ProdutorCadForm = ({ eventoTeclado, salvar, obj, atualizar, excluir, openModal }) => {
  const [formValido, setFormValido] = useState(false);
  const [erroCpf, setErroCpf] = useState('');
  const [erroCnpj, setErroCnpj] = useState('');

  useEffect(() => {
    validarFormulario();
  }, [obj]);

  const validarCpf = (valor) => {
    const numero = valor.replace(/\D/g, '');
    if (!cpf.isValid(numero)) {
      setErroCpf('CPF inválido.');
      return false;
    }
    setErroCpf('');
    return true;
  };

  const validarCnpj = (valor) => {
    const numero = valor.replace(/\D/g, '');
    if (!cnpj.isValid(numero)) {
      setErroCnpj('CNPJ inválido.');
      return false;
    }
    setErroCnpj('');
    return true;
  };

  const validarFormulario = () => {
    if (
      obj.nome &&
      obj.email &&
      obj.dataNascimento &&
      obj.sexo &&
      obj.endereco &&
      obj.imposto &&
      obj.repasse &&
      obj.repasseSobre &&
      obj.formaRepasse &&
      obj.cpf &&
      obj.telefone &&
      validarCpf(obj.cpf) &&
      validarCnpj(obj.cnpj)
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
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
    <div className="container-produtor">
      {/* Botões no topo */}
      <div className="botoes-produtor">
        <button onClick={salvar} disabled={!formValido} className={!formValido ? 'disabled-button' : ''}>
          Salvar
        </button>
        {obj.id && <button onClick={atualizar}>Atualizar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>

      <h1>Cadastro de Produtor</h1>

      <form>
        {/* Nome ocupa linha inteira */}
        <div className="input-field-produtor full-width">
          <label>Nome:</label>
          <input type="text" name="nome" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.nome} required />
        </div>

        {/* Linha com Email e Endereço */}
        <div className="input-field-produtor">
          <label>Email:</label>
          <input type="text" name="email" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.email} required />
        </div>

        <div className="input-field-produtor">
          <label>Endereço:</label>
          <input type="text" name="endereco" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.endereco} required />
        </div>

        {/* Linha com 3 campos: CPF, CNPJ, Data de Nascimento */}
        <div className="row-produtor">
          <div className="input-field-produtor">
            <label>CPF:</label>
            <InputMask
              mask="999.999.999-99"
              name="cpf"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              onBlur={(e) => validarCpf(e.target.value)}
              value={obj.cpf}
              required
            />
            {erroCpf && <span className="erro-texto">{erroCpf}</span>}
          </div>

          <div className="input-field-produtor">
            <label>CNPJ:</label>
            <InputMask
              mask="99.999.999/9999-99"
              name="cnpj"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              onBlur={(e) => validarCnpj(e.target.value)}
              value={obj.cnpj}
              required
            />
            {erroCnpj && <span className="erro-texto">{erroCnpj}</span>}
          </div>

          <div className="input-field-produtor">
            <label>Data de Nascimento:</label>
            <input type="date" name="dataNascimento" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.dataNascimento} required />
          </div>
        </div>

        {/* Linha com Sexo, Telefone e % Imposto */}
        <div className="row-produtor">
          <div className="input-field-produtor">
            <label>Sexo:</label>
            <select name="sexo" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.sexo} required>
              <option value="">Selecione o sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          <div className="input-field-produtor">
            <label>Telefone:</label>
            <InputMask mask="(99) 99999-9999" name="telefone" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.telefone} required />
          </div>

          <div className="input-field-produtor">
            <label>% Imposto:</label>
            <input type="number" name="imposto" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.imposto} required />
          </div>
        </div>

        {/* Linha com % Repasse, Repasse Sobre e Forma de Repasse */}
        <div className="row-produtor">
          <div className="input-field-produtor">
            <label>% Repasse:</label>
            <input type="number" name="repasse" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.repasse} required />
          </div>

          <div className="input-field-produtor">
            <label>Repasse Sobre:</label>
            <select name="repasseSobre" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.repasseSobre} required>
              <option value="">Selecione</option>
              <option value="Premio Liquido">Prêmio Líquido</option>
              <option value="Comissao Corretora">Comissão Corretora</option>
              <option value="Valor Fixo">Valor Fixo</option>
            </select>
          </div>

          <div className="input-field-produtor">
            <label>Forma de Repasse:</label>
            <select name="formaRepasse" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.formaRepasse} required>
              <option value="">Selecione</option>
              <option value="No Recebimento">No Recebimento</option>
              <option value="Antecipado 1 Parcela">Antecipado 1ª Parcela</option>
              <option value="Antecipado na Parcela">Antecipado na Parcela</option>
              <option value="Antecipado Emissão da Apólice">Antecipado Emissão da Apólice</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProdutorCadForm;
