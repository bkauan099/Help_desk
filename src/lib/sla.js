// Prévia de prioridade no formulário (o servidor é a fonte real — RF04).
export function preverPrioridade(cat, impacto) {
  if (!cat) return "—";
  if (impacto) return cat.critico ? "Crítica" : "Alta";
  return cat.critico ? "Média" : "Baixa";
}
