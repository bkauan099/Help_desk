# MP Desk — Protótipo

Protótipo navegável do **Help Desk para Telemedicina Hospitalar**, feito em
**React + Vite**. São **8 telas** navegáveis por links, cada uma indicando os
**requisitos funcionais (RF)** que atende — ligação direta com o PRD.

🔗 **Demo publicada:** «cole aqui o link do artefato / GitHub Pages»
📄 **PRD2:** [`docs/PRD2.md`](docs/PRD2.md) · **Checklist 7.1:** [`docs/CHECKLIST-7.1.md`](docs/CHECKLIST-7.1.md)

## Como rodar

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

## Divisão por integrante (para os commits)

A estrutura foi pensada para dividir o trabalho em **4 frentes** — cada pessoa
é dona de um conjunto de arquivos e faz os próprios commits. Ajuste os nomes.

| Frente | Responsável | Arquivos |
|---|---|---|
| **1. Base e shell** | «Integrante 1» | `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `src/main.jsx`, `src/styles.css`, `src/theme.js`, `src/App.jsx` |
| **2. Dados e regras** | «Integrante 2» | `src/data/*` (requisitos, usuarios, categorias, chamados, kb), `src/lib/*` (format, sla) |
| **3. Componentes + telas de listagem** | «Integrante 3» | `src/components/*` (Icon, ui, charts, TopNav, TicketRow), `src/screens/Login.jsx`, `Dashboard.jsx`, `TicketList.jsx` |
| **4. Telas de fluxo e gestão** | «Integrante 4» | `src/screens/NewTicket.jsx`, `TicketDetail.jsx`, `Knowledge.jsx`, `Reports.jsx`, `Admin.jsx` |
| **Documentação** | todos | `docs/PRD2.md`, `docs/CHECKLIST-7.1.md`, `README.md` |

### Ordem de commits sugerida (para o histórico ficar incremental)

1. `Integrante 1` — estrutura inicial do projeto (Vite, index.html, estilos, tema).
2. `Integrante 2` — dados de demonstração e regras de SLA.
3. `Integrante 3` — componentes compartilhados (ícones, UI, sidebar).
4. `Integrante 3` — telas Login, Painel e Fila de chamados.
5. `Integrante 4` — tela Abrir chamado e Detalhe do chamado.
6. `Integrante 4` — telas Base de conhecimento, Relatórios e Gestão.
7. `Integrante 1` — App.jsx integrando as telas (navegação por hash).
8. `todos` — PRD2, checklist 7.1 e README.

> Dica: para o professor ver a contribuição de cada um, **cada pessoa faz push
> dos seus próprios commits** (ou usem Pull Requests por frente). Assim o
> histórico do GitHub mostra o trabalho distribuído.

## Como subir no GitHub

```bash
git init
git add .
git commit -m "Estrutura inicial do protótipo MP Desk"
git branch -M main
git remote add origin https://github.com/«usuario»/«repositorio».git
git push -u origin main
```

Para publicar a demo no **GitHub Pages**: rode `npm run build` e publique a
pasta `dist/` (ou use a action `peaceiris/actions-gh-pages`). A `base: "./"`
no `vite.config.js` já deixa o build pronto para subdiretório.
