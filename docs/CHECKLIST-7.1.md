# Checklist 7.1 — Responsivo e acessível

Marque cada item ao validar. Ajuste conforme a seção 7.1 exigida pela disciplina.

## Responsividade

- [x] Layout se adapta a desktop, tablet e celular (ponto de quebra em ~860px).
- [x] Sem rolagem horizontal em nenhuma largura (gutter lateral ≥ 16px).
- [x] Grades (KPIs, gráficos, detalhe, gestão) empilham em 1 coluna no celular.
- [x] Barra lateral vira menu no topo (rolável) em telas pequenas.
- [x] Imagens e cartões com `max-width: 100%` (não estouram a tela).

## Acessibilidade

- [x] Idioma declarado (`<html lang="pt-BR">`).
- [x] Marcos semânticos: `header`, `nav`, `main`.
- [x] Link "Pular para o conteúdo" no início da página.
- [x] Foco visível no teclado (`:focus-visible`) em botões, campos e links.
- [x] Navegação possível somente pelo teclado (Tab / Enter / Esc).
- [x] Todos os campos de formulário têm rótulo associado (`label`/`aria-label`).
- [x] Estados comunicados por `aria-current`, `aria-selected`, `aria-expanded`, `aria-checked`.
- [x] Ícones decorativos marcados com `aria-hidden`; ícones informativos têm texto.
- [x] Logotipo com texto alternativo (`alt`).
- [x] Contraste de texto adequado sobre o fundo escuro.
- [x] Respeito a `prefers-reduced-motion` (desliga animações).
- [x] Significado nunca depende só de cor (status também tem rótulo textual).

## Navegação e PRD

- [x] Pelo menos 5 telas/estados navegáveis por links — o protótipo tem 8.
- [x] Cada tela indica os RFs que atende (selo "Atende: RFxx").
- [x] Nenhum RF essencial fica sem tela (ver matriz no PRD2 e card "Cobertura" no Painel).
- [x] Cada tela tem endereço próprio por hash (`#painel`, `#fila`, `#abrir`, `#detalhe`, `#base`, `#relatorios`, `#gestao`).

## A verificar manualmente antes da entrega

- [ ] Bater este checklist com o texto exato da **seção 7.1** da disciplina.
- [ ] Testar com leitor de tela (NVDA/VoiceOver) nas telas principais.
- [ ] Rodar auditoria Lighthouse (Acessibilidade) e anexar a pontuação.
