import { useState } from "react";
import Icon from "./Icon.jsx";
import { tempoRelativo } from "../lib/format";

// RF08 — Sino de notificações em tempo real (novos chamados, mudanças de status,
// novas mensagens e chamados que atingiram 80% do prazo de SLA).
export default function Notifications({ notifs = [], onAbrir, onLerTodas }) {
  const [open, setOpen] = useState(false);
  const naoLidas = notifs.filter((n) => !n.lida).length;

  return (
    <div className="notif-wrap">
      <button className="icon-btn notif-bell" aria-label={`Notificações${naoLidas ? ` (${naoLidas} não lidas)` : ""}`}
        aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="bell" size={18} />
        {naoLidas > 0 && <span className="notif-badge">{naoLidas > 9 ? "9+" : naoLidas}</span>}
      </button>

      {open && (
        <>
          <div className="notif-backdrop" onClick={() => setOpen(false)} />
          <div className="notif-panel" role="dialog" aria-label="Notificações">
            <div className="notif-head">
              <strong>Notificações</strong>
              {naoLidas > 0 && <button className="linkish" onClick={onLerTodas}>Marcar todas como lidas</button>}
            </div>
            <div className="notif-list">
              {notifs.length === 0 && <div className="notif-empty">Nenhuma notificação por enquanto.</div>}
              {notifs.map((n) => (
                <button key={n.id} className={"notif-item" + (n.lida ? "" : " un")}
                  onClick={() => { onAbrir(n); setOpen(false); }}>
                  <span className="notif-ico" style={{ background: (n.cor || "#1498b4") + "22", color: n.cor || "#1498b4" }}>
                    <Icon name={n.icon || "activity"} size={15} />
                  </span>
                  <span className="notif-body">
                    <span className="notif-tit">{n.titulo}</span>
                    <span className="notif-txt">{n.texto}</span>
                    <span className="notif-time">{tempoRelativo(n.data)}</span>
                  </span>
                  {!n.lida && <span className="notif-dot" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
