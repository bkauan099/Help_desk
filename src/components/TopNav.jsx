import React from "react";
import logo from "../assets/logo.jpg";
import { Icon } from "./Icon.jsx";
import { Avatar } from "./ui.jsx";

// Itens de menu por perfil (controle de acesso visual — RF01).
function itemsFor(isStaff, isAdmin) {
  if (isAdmin) return [["painel", "Painel", "painel"], ["fila", "Chamados", "inbox"], ["relatorios", "Relatórios", "bars"], ["gestao", "Gestão", "settings"], ["base", "Base de conhecimento", "book"]];
  if (isStaff) return [["painel", "Painel", "painel"], ["fila", "Chamados", "inbox"], ["relatorios", "Relatórios", "bars"], ["base", "Base de conhecimento", "book"]];
  return [["painel", "Painel", "painel"], ["fila", "Meus chamados", "inbox"], ["abrir", "Abrir chamado", "plus"], ["base", "Base de conhecimento", "book"]];
}

// Barra de menu superior (estilo GLPI).
export function TopNav({ user, view, go, isStaff, isAdmin, onLogout }) {
  const items = itemsFor(isStaff, isAdmin);
  const perfilLabel = { solicitante: "Solicitante", atendente: "Atendente", admin: "Administrador" }[user.perfil];
  return (
    <header className="topbar">
      <div className="topbar-in">
        <div className="tb-brand">
          <img className="logo" src={logo} alt="Logotipo do MP Desk" width="34" height="34" />
          <div><b>MP Desk</b><span>Telemedicina · Suporte</span></div>
        </div>
        <nav className="menu" aria-label="Navegação principal">
          {items.map(([k, label, ic]) => {
            const active = view === k || (k === "fila" && view === "detalhe");
            return (
              <button key={k} className={active ? "on" : ""} aria-current={active ? "page" : undefined} onClick={() => go(k)}>
                <Icon n={ic} s={16} /> <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <div className="tb-user">
          <div className="who"><b>{user.nome}</b><span>{perfilLabel}</span></div>
          <Avatar u={user} size={32} />
          <button className="icobtn" onClick={onLogout} aria-label="Sair do sistema" title="Sair"><Icon n="logout" s={17} /></button>
        </div>
      </div>
    </header>
  );
}
