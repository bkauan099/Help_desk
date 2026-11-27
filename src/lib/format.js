export const PESO = { "Crítica": 0, "Alta": 1, "Média": 2, "Baixa": 3 };

export function tempoRelativo(iso) {
  if (!iso) return "—";
  const d = new Date(iso), s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return "agora";
  if (s < 3600) return `há ${Math.floor(s / 60)} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  return `há ${Math.floor(s / 86400)} d`;
}
export function dataHora(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
// Situação do SLA de 1ª resposta/resolução (RF04) para exibição
export function slaInfo(ch) {
  const fim = ["Resolvido", "Fechado"].includes(ch.status);
  const prazo = ch.prazoResolucao ? new Date(ch.prazoResolucao) : null;
  if (!prazo) return { txt: "—", estado: "ok" };
  const restMin = (prazo.getTime() - Date.now()) / 60000;
  if (fim) return { txt: "concluído", estado: "ok" };
  if (restMin < 0) return { txt: "SLA estourado", estado: "ruim" };
  if (restMin < 60) return { txt: `${Math.round(restMin)} min restantes`, estado: "alerta" };
  return { txt: `${Math.round(restMin / 60)} h restantes`, estado: "ok" };
}
