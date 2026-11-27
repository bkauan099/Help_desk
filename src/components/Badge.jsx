export function PrioBadge({ p }) {
  const cls = { "Crítica": "prio-crit", "Alta": "prio-alta", "Média": "prio-media", "Baixa": "prio-baixa" }[p] || "prio-baixa";
  return <span className={`badge ${cls}`}>{p}</span>;
}
export function StatusBadge({ s }) {
  const cls = {
    "Aberto": "st-aberto", "Em atendimento": "st-andamento",
    "Aguardando solicitante": "st-aguardando", "Resolvido": "st-resolvido", "Fechado": "st-fechado",
  }[s] || "st-aberto";
  return <span className={`badge ${cls}`}>{s}</span>;
}
export function Avatar({ u, size = 30 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: u.cor, fontSize: size * 0.38 }} title={u.nome}>
      {u.ini}
    </span>
  );
}
