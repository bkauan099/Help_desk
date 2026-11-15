import React from "react";

// Ícones em SVG inline (sem dependência externa). `n` = nome; veja a lista em P.
const P = {
  painel: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
  inbox: "M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v7H3z",
  plus: "M12 5v14M5 12h14",
  book: "M4 4h13a2 2 0 0 1 2 2v14a3 3 0 0 0-3-3H4zM4 4v13",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  check: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.1l-3-3",
  circle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  star: "M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z",
  user: "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  chevron: "M9 18l6-6-6-6",
  back: "M19 12H5M12 19l-7-7 7-7",
  timer: "M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14V9M9 2h6",
  bars: "M3 3v18h18M7 16v-5M12 16V8M17 16v-9",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
  video: "M23 7l-7 5 7 5zM1 5h15v14H1z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  steth: "M4 3v6a5 5 0 0 0 10 0V3M4 3H2m2 0h2m6 0h2m-2 0h2M9 18a5 5 0 0 0 10 0v-2M19 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  cpu: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M5 5h14v14H5zM9 9h6v6H9z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  tag: "M20 10.5 13.5 4a2 2 0 0 0-1.4-.6H5a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4L10 20.5a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8zM7.5 7.5h.01",
  layers: "M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  gauge: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 12l4-4",
  trend: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  clip: "M21.4 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  x: "M18 6 6 18M6 6l12 12",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
};

export function Icon({ n, s = 18, c = "currentColor", fill, style }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill || "none"} stroke={c}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}
