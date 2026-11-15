// Formatação de datas (pt-BR).
export const two = (n) => String(n).padStart(2, "0");

export const fmt = (d) => {
  const t = new Date(d);
  return `${two(t.getDate())}/${two(t.getMonth() + 1)} ${two(t.getHours())}:${two(t.getMinutes())}`;
};

export const ago = (d) => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  return `há ${Math.floor(h / 24)} d`;
};
