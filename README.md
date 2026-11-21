# MP Desk — Protótipo

Protótipo navegável do **Help Desk para Telemedicina Hospitalar**, feito em
**React + Vite**. São **8 telas** navegáveis por links, cada uma indicando os
**requisitos funcionais (RF)** que atende — ligação direta com o PRD.

🔗 **Demo publicada:** «cole aqui o link do artefato / GitHub Pages»
📄 **PRD2:** [`docs/PRD2.md`](docs/PRD2.md) · **Checklist 7.1:** [`docs/CHECKLIST-7.1.md`](docs/CHECKLIST-7.1.md)

## Como rodar o codigo

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

Build de produção: `npm run build` (sai em `dist/`) · pré-visualizar: `npm run preview`.

No login, escolha um dos três perfis (Solicitante, Atendente, Administrador) —
cada um enxerga o sistema de forma diferente.

> Observação: é um protótipo de front-end. Os dados são de demonstração e vivem
> na sessão do navegador (recarregar reinicia). Não há back-end nesta entrega.

## As 8 telas e os RFs que atendem

| Tela | Arquivo | RFs |
|---|---|---|
| Login | `src/screens/Login.jsx` | RF01 |
| Painel | `src/screens/Dashboard.jsx` | RF05 |
| Fila de chamados | `src/screens/TicketList.jsx` | RF05 |
| Abrir chamado | `src/screens/NewTicket.jsx` | RF02, RF03 |
| Detalhe do chamado | `src/screens/TicketDetail.jsx` | RF04, RF05, RF06, RF07 |
| Base de conhecimento | `src/screens/Knowledge.jsx` | RF08 |
| Relatórios de SLA | `src/screens/Reports.jsx` | indicadores (gestão) |
| Gestão | `src/screens/Admin.jsx` | RF01, RF03 |

Cada tela tem endereço próprio por *hash*: `#painel`, `#fila`, `#abrir`,
`#detalhe`, `#base`, `#relatorios`, `#gestao`.

## Estrutura do projeto

```
mpdesk-prototipo/
├── index.html
├── package.json / vite.config.js
├── docs/
│   ├── PRD2.md                 # documento de requisitos (v2)
│   └── CHECKLIST-7.1.md        # responsivo e acessível
└── src/
    ├── main.jsx                # ponto de entrada (monta o React)
    ├── App.jsx                 # shell + navegação por hash + estado dos chamados
    ├── theme.js                # paleta e mapas de status/prioridade
    ├── styles.css              # estilos globais (tema escuro, responsivo)
    ├── assets/logo.jpg
    ├── data/                   # requisitos, usuarios, categorias, chamados, kb
    ├── lib/                    # format (datas) e sla (prioridade/prazos)
    ├── components/             # Icon, ui, charts, TopNav, TicketRow
    └── screens/                # as 8 telas
```
