import React from "react";
import { T } from "../theme.js";
import { Icon } from "./Icon.jsx";
import { RFS, SCREEN_RF } from "../data/requisitos.js";

export const Avatar = ({ u, size = 34 }) => (
  <div className="av" style={{ width: size, height: size, background: u.cor, fontSize: size * 0.38 }}>{u.ini}</div>
);

export const Badge = ({ c, children, solid }) => (
  <span className="badge" style={{ color: solid ? "#fff" : c, background: solid ? c : c + "1a", borderColor: solid ? c : c + "66" }}>{children}</span>
);

export function Btn({ children, onClick, kind = "solid", color = T.teal, small, disabled, full, ...r }) {
  const cl = "btn " + (full ? "btn-full " : "") + (small ? "btn-sm " : "");
  const st = kind === "solid" ? { background: color, color: "#fff", borderColor: color }
    : kind === "ghost" ? { background: "#fff", color: T.text, borderColor: T.line }
    : { background: color + "14", color, borderColor: color + "66" };
  return <button className={cl} style={st} onClick={onClick} disabled={disabled} {...r}>{children}</button>;
}

export const Card = ({ children, style, cls = "" }) => <div className={"card " + cls} style={style}>{children}</div>;

export const Meta = ({ label, i, children }) => (
  <div>
    <div className="row foot" style={{ gap: 6, margin: "0 0 4px" }}>{i && <Icon n={i} s={13} c={T.dim} />}{label}</div>
    <div style={{ fontSize: 13.5 }}>{children}</div>
  </div>
);

// Selo dos RFs que a tela atende — exibido no topo de cada tela (ligação com o PRD).
export function RfTag({ ids }) {
  if (!ids || !ids.length)
    return (
      <div className="rfrow" aria-label="Requisitos atendidos">
        <span className="rflabel">Atende:</span>
        <span className="rfchip rfchip-soft" title="Tela de indicadores de gestão (apoia RNF de desempenho/SLA)">Indicadores de gestão</span>
      </div>
    );
  return (
    <div className="rfrow" aria-label="Requisitos funcionais atendidos por esta tela">
      <span className="rflabel">Atende:</span>
      {ids.map((id) => <span key={id} className="rfchip" title={RFS[id]}>{id} · {RFS[id]}</span>)}
    </div>
  );
}

export function ScreenHead({ view, titulo, sub, right }) {
  return (
    <header className="shead">
      <div className="shead-main">
        <h1 className="h1">{titulo}</h1>
        {sub && <p className="sub" style={{ marginTop: 4 }}>{sub}</p>}
        <RfTag ids={SCREEN_RF[view]} />
      </div>
      {right}
    </header>
  );
}
