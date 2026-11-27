export const RF = {
  RF01: "Login e controle de acesso por perfil",
  RF02: "Cadastro e gestão de usuários",
  RF03: "Abertura de chamado (com anexos)",
  RF04: "Cálculo automático de prioridade e SLA",
  RF05: "Fila de atendimento e atribuição de técnico",
  RF06: "Histórico e mudança de status",
  RF07: "Troca de mensagens em tempo real",
  RF08: "Notificações em tempo real",
  RF09: "Avaliação do atendimento",
  RF10: "Base de conhecimento (publicar e buscar)",
  RF11: "Sugestão de artigos na abertura",
  RF12: "Dashboard de indicadores (admin)",
  RF13: "Categorias e prazos de SLA",
  RF14: "Reabertura e fechamento automático",
};
export const SCREEN_RF = {
  login: ["RF01"], painel: ["RF05", "RF08"], chamados: ["RF05", "RF06"],
  novo: ["RF03", "RF04", "RF11"], detalhe: ["RF06", "RF07", "RF09", "RF14"],
  base: ["RF10"], relatorios: ["RF12"], gestao: ["RF02", "RF13"],
};
export const selo = (tela) => (SCREEN_RF[tela] || []).map((k) => `${k} · ${RF[k]}`);
