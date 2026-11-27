// Conexão WebSocket do chat em tempo real (RF07).
import { api, getToken } from "./api";

export function conectarWs(onEvento) {
  const wsBase = api.base.replace(/^http/, "ws").replace(/\/api$/, "");
  let ws, vivo = true, timer;
  function abrir() {
    const token = getToken();
    if (!token) return;
    ws = new WebSocket(`${wsBase}/ws?token=${encodeURIComponent(token)}`);
    ws.onmessage = (ev) => { try { onEvento(JSON.parse(ev.data)); } catch (e) {} };
    ws.onclose = () => { if (vivo) timer = setTimeout(abrir, 2000); };
    ws.onerror = () => { try { ws.close(); } catch (e) {} };
  }
  abrir();
  return () => { vivo = false; clearTimeout(timer); try { ws && ws.close(); } catch (e) {} };
}
