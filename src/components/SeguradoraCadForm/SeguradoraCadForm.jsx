import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { cnpj } from 'cpf-cnpj-validator';
import './SeguradoraCadForm.css';

export const SeguradoraCadForm = ({ eventoTeclado, salvar, obj, openModal, atualizar, excluir }) => {
  const [formValido, setFormValido] = useState(false);
  const [erroCnpj, setErroCnpj] = useState('');

  useEffect(() => {
    validarFormulario();
  }, [obj]);

  const validarFormulario = () => {
    if (
      obj.nome &&
      obj.nomefan &&
      obj.email &&
      obj.cnpj &&
      obj.telefone &&
      obj.susep &&
      obj.impSeguradora &&
      validarCnpj(obj.cnpj)
    ) {
      setFormValido(true);
    } else {
      setFormValido(false);
    }
  };

  const validarCnpj = (valor) => {
    const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!cnpj.isValid(numero)) {
      setErroCnpj('CNPJ inválido.');
      return false;
    }

    setErroCnpj('');
    return true;
  };

  const handleBlurCnpj = (event) => {
    const valor = event.target.value.replace(/\D/g, ''); // Apenas valida, sem formatar novamente
    validarCnpj(valor);
    validarFormulario();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  return (
    <div className="container-seguradora">
      <div className="botoes-seguradora">
        <button onClick={salvar} disabled={!formValido} className={!formValido ? 'disabled-button' : ''}>
          Salvar
        </button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>
      <h1 id='title-seguradora'>Seguradora</h1>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="input-field-seguradora">
          <label htmlFor="nomeSeg">Nome:</label><br />
          <input type="text" id="nomeSeg" name="nome" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.nome} required />
        </div>

        <div className="input-field-seguradora">
          <label htmlFor="nomeFanSeg">Nome Fantasia:</label><br />
          <input type="text" id="nomeFanSeg" name="nomefan" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.nomefan} required />
        </div>

        <div className="input-field-seguradora">
          <label htmlFor="emailSeg">E-mail:</label><br />
          <input type="email" id="emailSeg" name="email" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.email} required />
        </div>

        <div className="row-seg">
          <div className="input-field-seguradora">
            <label htmlFor="cnpjSeg">CNPJ:</label><br />
            <InputMask mask="99.999.999/9999-99" value={obj.cnpj} onBlur={handleBlurCnpj} onChange={eventoTeclado} onKeyDown={handleKeyDown}>
              {(inputProps) => (
                <input {...inputProps} type="text" id="cnpjSeg" name="cnpj" required />
              )}
            </InputMask>
            {erroCnpj && <span className="erro-texto">{erroCnpj}</span>}
          </div>

          <div className="input-field-seguradora">
            <label htmlFor="telefoneSeg">Telefone:</label><br />
            <InputMask mask="(99) 99999-9999" value={obj.telefone} onChange={eventoTeclado} onKeyDown={handleKeyDown}>
              {(inputProps) => (
                <input {...inputProps} type="text" id="telefoneSeg" name="telefone" required />
              )}
            </InputMask>
          </div>

          <div className="input-field-seguradora">
            <label htmlFor="susepSeg">SUSEP:</label><br />
            <input type="text" id="susepSeg" name="susep" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.susep} required />
          </div>

          <div className="input-field-seguradora">
            <label htmlFor="impostoSeg">Imposto:</label><br />
            <input type="number" id="impostoSeg" name="impSeguradora" onKeyDown={handleKeyDown} onChange={eventoTeclado} value={obj.impSeguradora} required />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeguradoraCadForm;
