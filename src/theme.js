// Paleta inspirada no PET-Saúde (teal + laranja sobre fundo claro),
// com layout no estilo de um help desk real (GLPI). Tema único claro.
export const T = {
  bg: "#eef1f5", panel: "#f3f6f9", card: "#ffffff", cardHi: "#f1f5f9",
  line: "#dce3ea", lineSoft: "#e7ecf1",
  navy: "#163a52", navyDk: "#102c3f",            // barra superior / títulos
  teal: "#1498b4", tealDk: "#0d7f98", tealLt: "#e3f3f6",  // cor primária
  rust: "#e8622a", rustDk: "#cf5423", rustLt: "#fbe7dd",  // ação / destaque
  blue: "#3f7cb4", blueDk: "#2d5c8c", blueLt: "#7aa9d8",
  text: "#22303d", muted: "#647386", dim: "#93a0ad",
  green: "#3ba55d", amber: "#e0a32e", red: "#d9534f",
};

// Status do chamado -> cor + nome do ícone (ver components/Icon.jsx).
export const STATUS = {
  "Aberto":         { c: T.blue,  i: "circle" },
  "Em atendimento": { c: T.teal,  i: "activity" },
  "Aguardando":     { c: T.amber, i: "clock" },
  "Resolvido":      { c: T.green, i: "check" },
  "Fechado":        { c: T.dim,   i: "circle" },
};

// Prioridade -> cor.
export const PRIO = { "Crítica": T.red, "Alta": T.rust, "Média": T.blue, "Baixa": T.dim };
