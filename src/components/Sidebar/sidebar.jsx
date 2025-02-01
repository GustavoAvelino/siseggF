import React, { useState } from "react";
import { FaHome, FaCalculator, FaUser } from "react-icons/fa";
import { HiClipboardDocument } from "react-icons/hi2";
import { LuFileWarning } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPaper, IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import "./sidebar.css"; // Importando o CSS corretamente

export const Sidebar = () => {
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);

  const toggleCadastros = () => {
    setIsCadastrosOpen(!isCadastrosOpen);
  };

  return (
    <aside className="sidebar">
      <nav>
        <div id="logo-container">
                  {/* Link para a rota Home */}
                  <Link to="/home" id="logo">Sisegg</Link>
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
            <Link to="/corretoracad">Corretora</Link>
            <Link to="/usuariocad">Usuário</Link>
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

        <button>
          <span>
            <MdAttachMoney />
            <span>Financeiro</span>
          </span>
        </button>

        <button>
          <span>
            <IoIosPaper />
            <span>Relatórios</span>
          </span>
        </button>

        <button>
          <span>
            <IoMdSettings />
            <span>Configurações</span>
          </span>
        </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
