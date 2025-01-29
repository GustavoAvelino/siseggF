import React from 'react';
import InputMask from 'react-input-mask';  
import './SeguradoraCadForm.css';

export const SeguradoraCadForm = ({ eventoTeclado, salvar, obj, openModal, atualizar, excluir }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Envio de formulário de seguradora.");
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
        <button onClick={salvar}>Salvar</button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>
      <h1 id='title-seguradora'>Seguradora</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo: Nome */}
        <div className="input-field-seguradora">
          <label htmlFor="nomeSeg">Nome:</label><br />
          <input
            type="text"
            id="nomeSeg"
            name="nome"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.nome}
            required
          />
        </div>

        {/* Campo: Nome Fantasia */}
        <div className="input-field-seguradora">
          <label htmlFor="nomeFanSeg">Nome Fantasia:</label><br />
          <input
            type="text"
            id="nomeFanSeg"
            name="nomefan"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.nomefan}
            required
          />
        </div>

        {/* Campo: E-mail */}
        <div className="input-field-seguradora">
          <label htmlFor="emailSeg">E-mail:</label><br />
          <input
            type="email"
            id="emailSeg"
            name="email"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.email}
            required
          />
        </div>

        {/* Linha com CNPJ, Telefone, SUSEP e Imposto */}
        <div className="row-seg">
          <div className="input-field-seguradora" id="cnpjSeg">
            <label htmlFor="cnpj">CNPJ:</label><br />
            <InputMask
              mask="99.999.999/9999-99"
              value={obj.cnpj}
              onChange={eventoTeclado}
              onKeyDown={handleKeyDown}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  id="cnpjSeg"
                  name="cnpj"
                  required
                />
              )}
            </InputMask>
          </div>

          <div className="input-field-seguradora" id="telefoneSeg">
            <label htmlFor="telefone">Telefone:</label><br />
            <InputMask
              mask="(99) 99999-9999"
              value={obj.telefone}
              onChange={eventoTeclado}
              onKeyDown={handleKeyDown}
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  id="telefoneSeg"
                  name="telefone"
                  required
                />
              )}
            </InputMask>
          </div>

          <div className="input-field-seguradora">
            <label htmlFor="susepSeg">SUSEP:</label><br />
            <input
              type="text"
              id="susepSeg"
              name="susep"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.susep}
              required
            />
          </div>

          <div className="input-field-seguradora">
            <label htmlFor="impostoSeg">Imposto:</label><br />
            <input
              type="number"
              id="impostoSeg"
              name="impSeguradora"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.impSeguradora}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeguradoraCadForm;