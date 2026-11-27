// Prévia de prioridade no formulário (o servidor é a fonte real — RF04).
export function preverPrioridade(cat, impacto) {
  if (!cat) return "—";
  if (impacto) return cat.critico ? "Crítica" : "Alta";
  return cat.critico ? "Média" : "Baixa";
}

// RF08 — fração do prazo de SLA já decorrida (0..1+). Usada no aviso de 80%.
export function pctSla(t) {
  if (!t || !t.prazoResolucao || !t.criadoEm) return 0;
  const ini = new Date(t.criadoEm).getTime();
  const fim = new Date(t.prazoResolucao).getTime();
  if (fim <= ini) return 0;
  return (Date.now() - ini) / (fim - ini);
}
