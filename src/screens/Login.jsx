import React from "react";
import logo from "../assets/logo.jpg";
import { T } from "../theme.js";
import { Icon } from "../components/Icon.jsx";
import { Avatar, Card } from "../components/ui.jsx";
import { RFS } from "../data/requisitos.js";
import { USERS } from "../data/usuarios.js";

// Tela de Login — RF01 (autenticação e seleção de perfil).
export function Login({ onLogin }) {
  const roles = [
    { u: USERS[0], titulo: "Solicitante", desc: "Médicos e equipe que abrem chamados", c: T.rust },
    { u: USERS[2], titulo: "Atendente", desc: "Suporte técnico que resolve chamados", c: T.teal },
    { u: USERS[4], titulo: "Administrador", desc: "Coordenação de TI e indicadores", c: T.navy },
  ];
  return (
    <div className="login">
      <div className="login-box">
        <div className="login-brand">
          <img className="logo" src={logo} alt="Logotipo do MP Desk" width="52" height="52" />
          <div><b>MP Desk</b><span>Suporte à telemedicina hospitalar</span></div>
        </div>
        <Card style={{ padding: 20 }}>
          <div className="rfrow" style={{ marginBottom: 12, marginTop: 0 }}>
            <span className="rflabel">Atende:</span>
            <span className="rfchip" title={RFS.RF01}>RF01 · {RFS.RF01}</span>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4, color: T.navy }}>Entrar no sistema</div>
          <p className="sub" style={{ margin: "0 0 16px" }}>Escolha um perfil de demonstração para explorar o protótipo.</p>
          <div className="col" style={{ gap: 9 }}>
            {roles.map((r) => (
              <button key={r.u.id} className="role" onClick={() => onLogin(r.u)} style={{ "--rc": r.c }}>
                <Avatar u={r.u} size={38} />
                <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontWeight: 700, fontSize: 13.5, color: T.navy }}>{r.titulo}</div><div className="sub" style={{ fontSize: 12.5 }}>{r.desc}</div></div>
                <Icon n="chevron" s={18} c={T.dim} />
              </button>
            ))}
          </div>
        </Card>
        <p className="foot" style={{ textAlign: "center", marginTop: 14 }}>Protótipo navegável · 8 telas ligadas ao PRD · dados de demonstração</p>
      </div>
    </div>
  );
}
