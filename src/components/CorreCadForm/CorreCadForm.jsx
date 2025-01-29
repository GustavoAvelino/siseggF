import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import './CorreCadForm.css';

export const CorreCadForm = ({ eventoTeclado, salvar, obj, openModal, atualizar, excluir }) => {
  const [estado, setEstado] = useState(obj.estado || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Envio de formulário de corretora.");
  };

  const handleSelectChange = (event) => {
    setEstado(event.target.value);
    eventoTeclado(event);
  };

  useEffect(() => {
    setEstado(obj.estado || "");
  }, [obj.estado]);

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
    <div className="container-corretora">
      <div className="botoes-corretora">
        <button onClick={salvar}>Salvar</button>
        {obj.id && <button onClick={atualizar}>Editar</button>}
        {obj.id && <button onClick={excluir}>Excluir</button>}
        <button onClick={openModal}>Consultar</button>
      </div>

      <h1 id='title-corretora'>Corretora</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-field-corretora">
          <label htmlFor="nomeCompletoCorretora">Nome:</label><br />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="nomeCompletoCorretora"
            name="nome"
            value={obj.nome}
            required
          />
        </div>

        <div className="input-field-corretora">
          <label htmlFor="nomeFantasiaCorretora">Nome Fantasia:</label><br />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="nomeFantasiaCorretora"
            name="nomefan"
            value={obj.nomefan}
          />
        </div>

        <div className="input-field-corretora">
          <label htmlFor="emailCorretora">E-mail:</label><br />
          <input
            type="email"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="emailCorretora"
            name="email"
            value={obj.email}
            required
          />
        </div>

        <div className="input-field-corretora">
          <label htmlFor="enderecoCorretora">Endereço:</label><br />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="ruaCorretora"
            name="rua"
            placeholder="Rua"
            value={obj.rua}
            required
          />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="numeroCorretora"
            name="numero"
            placeholder="Número"
            value={obj.numero}
            required
          />
          <br /><br />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="bairroCorretora"
            name="bairro"
            placeholder="Bairro"
            value={obj.bairro}
            required
          />
          <input
            type="text"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            id="cidadeCorretora"
            name="cidade"
            placeholder="Cidade"
            value={obj.cidade}
            required
          />
          <select
            id="estadoCorretora"
            value={estado}
            onChange={handleSelectChange}
            onKeyDown={handleKeyDown}
            name="estado"
            required
          >
            <option value="" disabled>Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>

        <div className="row-corretora">
          <div className="input-field-corretora">
            <label htmlFor="cnpjCorretora">CNPJ:</label><br />
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
                  id="cnpjCorretora"
                  name="cnpj"
                  required
                />
              )}
            </InputMask>
          </div>

          <div className="input-field-corretora">
            <label htmlFor="susepCorretora">SUSEP:</label><br />
            <input
              type="text"
              id="susepCorretora"
              name="susep"
              onKeyDown={handleKeyDown}
              onChange={eventoTeclado}
              value={obj.susep}
              required
            />
          </div>

          <div className="input-field-corretora">
            <label htmlFor="telefoneCorretora">Telefone:</label><br />
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
                  id="telefoneCorretora"
                  name="telefone"
                  required
                />
              )}
            </InputMask>
          </div>

          <div className="input-field-corretora">
          <label htmlFor="impostoCorretora">Imposto:</label><br />
          <input
            type="number"
            id="impostoCorretora"
            name="impCorretora"
            onKeyDown={handleKeyDown}
            onChange={eventoTeclado}
            value={obj.impCorretora}
            required
          />
        </div>

        </div>

        
      </form>
    </div>
  );
};

export default CorreCadForm;
