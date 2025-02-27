import React, { useState } from "react";
import { FaCalculator, FaUser } from "react-icons/fa";
import { HiClipboardDocument } from "react-icons/hi2";
import { LuFileWarning } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPaper, IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import "./sidebar.css";

export const Sidebar = () => {
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);
  const [isRelatoriosOpen, setIsRelatoriosOpen] = useState(false);

  // Pegando o role do usuário armazenado no localStorage
  const userRole = parseInt(localStorage.getItem("role"), 10);

  const toggleCadastros = () => {
    setIsCadastrosOpen(!isCadastrosOpen);
  };

  const toggleFinanceiro = () => {
    setIsFinanceiroOpen(!isFinanceiroOpen);
  };

  const toggleRelatorios = () => {
    setIsRelatoriosOpen(!isRelatoriosOpen);
  };

  return (
    <aside className="sidebar">
      <nav>
        <div id="logo-container">
          <Link to="/" id="logo">
            Sisegg
          </Link>
        </div>

        <div id="nav-container">
          {/* MENU Cadastros */}
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
              {(userRole === 4 || userRole === 1) && (
                <Link to="/usuariocad">Usuário</Link>
              )}
              {(userRole === 4 || userRole === 1) && (
                <Link to="/produtorcad">Produtor</Link>
              )}
              <Link to="/seguradoracad">Seguradora</Link>
            </div>
          )}

          {/* MENU Multicalculo */}
          <Link to="/multicalculo-list" style={{ textDecoration: "none", color: "inherit" }}>
            <button>
              <span>
                <FaCalculator />
                <span>Multicálculo</span>
              </span>
            </button>
          </Link>


          {/* MENU Propostas/Apólices */}
          <button>
            <span>
              <Link
                to="/proposta-apolice"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <HiClipboardDocument />
                <span>Propostas e Apólices</span>
              </Link>
            </span>
          </button>


          {/* MENU Financeiro */}
          <button onClick={toggleFinanceiro}>
            <span>
              <MdAttachMoney />
              <span>Financeiro</span>
            </span>
          </button>
          {isFinanceiroOpen && (
            <div className="submenu-cadastros">
              <Link to="/gradecomissao">Grade de Comissão</Link>
              <Link to="/contas-a-receber">Contas a Receber</Link>
              <Link to="/baixa-Parcelas">Baixa Parcelas</Link>
            </div>
          )}

          {/* MENU Relatórios */}
          <button onClick={toggleRelatorios}>
            <span>
              <IoIosPaper />
              <span>Relatórios</span>
            </span>
          </button>
          {isRelatoriosOpen && (
            <div className="submenu-cadastros">
              <Link to="/relatorio-comissao-produtor">
                Relatório Comissão Produtor
              </Link>
            </div>
          )}

        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
