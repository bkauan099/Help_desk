import Icon from "./Icon.jsx";
import { Avatar } from "./Badge.jsx";

const ITENS = [
  { k: "painel", rot: "Painel", ic: "home" },
  { k: "chamados", rot: "Chamados", ic: "ticket" },
  { k: "base", rot: "Base de conhecimento", ic: "book" },
  { k: "relatorios", rot: "Relatórios", ic: "chart" },
  { k: "gestao", rot: "Gestão", ic: "users", perfis: ["admin"] },
];

const PERFIL_ROT = { solicitante: "Solicitante", atendente: "Atendente", admin: "Administrador" };

export default function TopNav({ user, view, go, sair }) {
  return (
    <header className="top">
      <div className="brand"><span className="dot">MP</span> MP Desk</div>
      <nav className="nav">
        {ITENS.filter((i) => !i.perfis || i.perfis.includes(user.perfil)).map((i) => (
          <button key={i.k} className={view === i.k ? "on" : ""} onClick={() => go(i.k)}>
            <Icon name={i.ic} size={16} /> {i.rot}
          </button>
        ))}
      </nav>
      <div className="me">
        <div style={{ textAlign: "right" }}>
          <strong style={{ fontSize: 13 }}>{user.nome}</strong>
          <small>{PERFIL_ROT[user.perfil] || user.perfil}</small>
        </div>
        <Avatar u={user} size={34} />
        <button className="icon-btn" title="Sair" onClick={sair}><Icon name="logout" size={18} /></button>
      </div>
    </header>
  );
}
