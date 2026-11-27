// Ícones em SVG inline (sem dependências).
const P = {
  video: "M15 10l4.5-2.5v9L15 14M4 6h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z",
  steth: "M6 3v5a4 4 0 008 0V3M19 14a3 3 0 11-6 0M10 12v4a6 6 0 006 6",
  cpu: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  tag: "M20 12l-8 8-9-9V4h7l10 8zM7.5 7.5h.01",
  ticket: "M4 6h16v4a2 2 0 000 4v4H4v-4a2 2 0 000-4V6z",
  users: "M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8M23 20v-2a4 4 0 00-3-3.87M16 2.13A4 4 0 0116 10",
  chart: "M3 3v18h18M7 14l3-3 3 3 5-6",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM19 3v18",
  home: "M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  clip: "M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a1.5 1.5 0 01-2-2l8-8",
  star: "M12 2l3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  undo: "M3 7v6h6M3.5 13a9 9 0 102.1-9.4L3 7",
  inbox: "M3 12h5l2 3h4l2-3h5M3 12l3-7h12l3 7v7H3z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  check: "M20 6L9 17l-5-5",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 7v5l3 2",
  x: "M18 6 6 18M6 6l12 12",
  timer: "M12 22a8 8 0 100-16 8 8 0 000 16zM12 14V9M9 2h6",
};
export default function Icon({ name, size = 18, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] || P.tag} />
    </svg>
  );
}
