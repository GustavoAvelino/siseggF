import React, { useState } from "react";
import { FaCalculator, FaUser } from "react-icons/fa";
import { HiClipboardDocument } from "react-icons/hi2";
import { LuFileWarning } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPaper, IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import "./sidebar.css"; // Importando o CSS corretamente

export const Sidebar = () => {
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);

  // Pegando o role do usuário armazenado no localStorage
  const userRole = parseInt(localStorage.getItem("role"), 10);

  const toggleCadastros = () => {
    setIsCadastrosOpen(!isCadastrosOpen);
  };

  const toggleFinanceiro = () => {
    setIsFinanceiroOpen(!isFinanceiroOpen);
  };

  return (
    <aside className="sidebar">
      <nav>
        <div id="logo-container">
          {/* Link para a rota Home */}
          <Link to="/" id="logo">Sisegg</Link>
        </div>
        
        <div id="nav-container">
          <button onClick={toggleCadastros}>
            <span>
              <FaUser />
              <span>Cadastros</span>
            </span>
          </button>

          {isCadastrosOpen && (
            <div className="submenu-cadastros">
              <Link to="/clientecad">Cliente</Link>
              {userRole === 4 && <Link to="/corretoracad">Corretora</Link>}
              {(userRole === 4 || userRole === 1) && <Link to="/usuariocad">Usuário</Link>}
              {(userRole === 4 || userRole === 1) && <Link to="/produtorcad">Produtor</Link>}
              <Link to="/seguradoraCad">Seguradora</Link>
            </div>
          )}

          <button>
            <span>
              <FaCalculator />
              <span>Multicálculo</span>
            </span>
          </button>

          <button>
            <span>
              <HiClipboardDocument />
              <span>Propostas e Apólices</span>
            </span>
          </button>

          <button>
            <span>
              <LuFileWarning />
              <span>Sinistros</span>
            </span>
          </button>

          {/* Menu Financeiro com submenu */}
          <button onClick={toggleFinanceiro}>
            <span>
              <MdAttachMoney />
              <span>Financeiro</span>
            </span>
          </button>

          {isFinanceiroOpen && (
            <div className="submenu-cadastros">
              <Link to="/gradecomissao">Grade de Comissão</Link>
            </div>
          )}

          <button>
            <span>
              <IoIosPaper />
              <span>Relatórios</span>
            </span>
          </button>

          {(userRole === 4 || userRole === 1) && (
            <button>
              <span>
                <IoMdSettings />
                <span>Configurações</span>
              </span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
