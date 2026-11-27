export const RF = {
  RF01: "Login e controle de acesso por perfil",
  RF02: "Cadastro e gestão de usuários",
  RF03: "Abertura de chamado (com anexos)",
  RF04: "Cálculo automático de prioridade e SLA",
  RF05: "Fila de atendimento e atribuição de técnico",
  RF06: "Histórico e mudança de status",
  RF07: "Troca de mensagens em tempo real",
  RF09: "Avaliação do atendimento",
  RF10: "Base de conhecimento",
  RF11: "Busca / FAQ",
  RF12: "Relatórios e indicadores",
  RF13: "Gestão de categorias",
};
export const SCREEN_RF = {
  login: ["RF01"], painel: ["RF05", "RF12"], chamados: ["RF05", "RF06"],
  novo: ["RF03", "RF04"], detalhe: ["RF06", "RF07", "RF09"],
  base: ["RF10", "RF11"], relatorios: ["RF12"], gestao: ["RF02", "RF13"],
};
export const selo = (tela) => (SCREEN_RF[tela] || []).map((k) => `${k} · ${RF[k]}`);
