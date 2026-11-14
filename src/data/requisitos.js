// Requisitos funcionais e a ligação com o PRD (cada tela indica os RFs que atende).
// IMPORTANTE: numeração alinhada ao PRD2. Ajuste aqui se o PRD de vocês usar outra.
export const RFS = {
  RF01: "Autenticação e cadastro de usuários",
  RF02: "Abertura de chamado",
  RF03: "Categorização e priorização (SLA)",
  RF04: "Atribuição a atendente",
  RF05: "Acompanhamento de status",
  RF06: "Comunicação no chamado",
  RF07: "Avaliação do atendimento",
  RF08: "Base de conhecimento (FAQ)",
};

// Telas do protótipo -> RFs que cada uma atende.
// Uma tela sem RF (ex.: relatórios) é apoio de gestão (RNF), não requisito essencial.
export const SCREEN_RF = {
  login: ["RF01"],
  painel: ["RF05"],
  fila: ["RF05"],
  abrir: ["RF02", "RF03"],
  detalhe: ["RF04", "RF05", "RF06", "RF07"],
  base: ["RF08"],
  relatorios: [],
  gestao: ["RF01", "RF03"],
};

export const TELA_NOME = {
  login: "Login", painel: "Painel", fila: "Fila de chamados", abrir: "Abrir chamado",
  detalhe: "Detalhe do chamado", base: "Base de conhecimento", relatorios: "Relatórios de SLA", gestao: "Gestão",
};
