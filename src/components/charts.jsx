import React from "react";
import { T } from "../theme.js";

// Gráfico de rosca (donut) em SVG, usado no Painel.
export function Donut({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Distribuição por status">
        <circle cx="70" cy="70" r={R} fill="none" stroke={T.panel} strokeWidth="18" />
        {data.map((d, i) => {
          const frac = d.value / total, dash = frac * C, off = acc * C; acc += frac;
          return <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={d.c} strokeWidth="18"
            strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-off} transform="rotate(-90 70 70)" />;
        })}
        <text x="70" y="64" textAnchor="middle" fill={T.text} fontSize="22" fontWeight="800">{total}</text>
        <text x="70" y="84" textAnchor="middle" fill={T.muted} fontSize="11">chamados</text>
      </svg>
      <div className="legend">
        {data.map((d) => <div key={d.name} className="lg"><span className="dot" style={{ background: d.c }} /><span className="sub">{d.name}</span><b>{d.value}</b></div>)}
      </div>
    </div>
  );
}

// Lista de barras horizontais (categoria/prioridade).
export function Bars({ data }) {
  const max = Math.max(1, ...data.map((x) => x.value));
  return (
    <div className="col" style={{ gap: 9, marginTop: 4 }}>
      {data.map((d) => (
        <div key={d.name}>
          <div className="barlab"><span className="sub">{d.name}</span><b>{d.value}</b></div>
          <div className="track"><div className="fill" style={{ width: (d.value / max) * 100 + "%", background: d.c || T.blue }} /></div>
        </div>
      ))}
    </div>
  );
}
