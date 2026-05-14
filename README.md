# Sistema de Ilhas — Design System

> Sistema visual para o **Sistema de Ilhas**, um app de fluxo de demandas entre ilhas de desenvolvimento (Bruna → Design → Dev A / Dev B → Integração).

Este design system substitui a paleta original (roxo cósmico em fundo escuro) por um **arquipélago de dia**: céu azul claro, água, ilhas flutuantes, e botões de destaque em **laranja quente**. Todas as janelas flutuantes — modais, painéis, cards de demanda — usam **cantos bem arredondados** (20–32px) para reforçar a metáfora de ilhas flutuando.

## Fontes do contexto

- Codebase Next.js anexada: `SistemaIlhas/` (FastAPI + SQLite no backend, App Router + TS no frontend)
- README original do produto: `SistemaIlhas/README.md`
- CSS legado (fundo escuro, glassmorphism roxo): `SistemaIlhas/frontend/app/globals.css`
- Componentes-chave estudados: `Island.tsx`, `IslandModal.tsx`, `Topbar.tsx`, `dashboard/page.tsx`
- Tipos do domínio: `SistemaIlhas/frontend/lib/types.ts` (Ilha, Etapa, Demanda, Role, etc.)
- Ilustrações das ilhas (PNGs gerados em estilo 3D fantasy): copiadas em `assets/islands/`

Não suponha que o leitor tem acesso a esses caminhos — eles estão registrados aqui caso o codebase seja remontado.

---

## O produto, resumido

**O quê:** um pequeno SaaS interno para a Bruna gerenciar demandas que passam por várias "ilhas" de pessoas (Design, Dev experiente, Dev aprendiz, Integração final). Cada ilha tem membros atribuídos por `role`. Uma demanda flui de ilha em ilha via "check-in" — quando uma ilha conclui, a próxima vira **ativa**.

**Vocabulário canônico do produto** (sempre em PT-BR, sem traduzir):
- **Ilha** — uma fase do fluxo + as pessoas atribuídas a ela
- **Arquipélago** — a visualização de todas as ilhas juntas
- **Demanda** — uma tarefa que percorre o arquipélago
- **Etapa** — o estado de uma demanda numa ilha específica (`pendente` / `ativa` / `concluída`)
- **Check-in** — ato de fechar uma etapa e passar a demanda adiante
- **Anexo** — link ou arquivo enviado para uma etapa

**Fluxo:** Bruna abre uma demanda → faz check-in na ilha Bruna → Design vira ativa → Designer entrega + check-in → Dev A e Dev B viram ativas em paralelo → ambas dão check-in → Integração vira ativa → último check-in conclui a demanda.

---

## Mudanças face ao legado

| | Antes | Agora |
|---|---|---|
| Fundo | Azul-quase-preto cósmico + estrelas | Céu azul claro com nuvens sutis |
| Vidro | rgba(255,255,255,0.05) sobre escuro | rgba(255,255,255,0.55) sobre céu (mais sólido) |
| Primária | Gradiente roxo→azul aurora | **Laranja coral** quente, sólido |
| Status "ativa" | Brilho roxo | Brilho azul-céu profundo |
| Cantos das janelas | 12 / 18 / 28 px | **16 / 24 / 32 px** (mais arredondados) |
| Tom | Cosmic, futurista | Diurno, leve, acolhedor |
| Texto principal | Branco sobre escuro | Azul-marinho escuro sobre claro |

A metáfora das **ilhas flutuantes** continua: animação `float`, glow embaixo de cada ilha, hover/popover de membros. As ilustrações PNG das ilhas (estilo fantasy 3D) são reaproveitadas — elas funcionam ainda melhor contra um céu azul do que contra fundo escuro.

---

## CONTENT FUNDAMENTALS

O produto fala **português brasileiro casual e direto**, sem corporativismo. Tom de "ferramenta interna feita pra gente que se conhece".

- **Idioma:** PT-BR sempre. Nunca em inglês na UI. `e-mail`, `entrar`, `cadastrar`, `concluir`, `check-in` (essa fica), `arquivo`, `link`.
- **Casing:** Sentence case em botões e títulos. **Nunca ALL CAPS** no corpo (só em micro-labels de seção tipo "DEMANDAS"/"PESSOAS ATRIBUÍDAS", em 11–12px com letter-spacing).
- **Pessoa verbal:** Mistura `você` implícito e infinitivo: "Entrar", "Criar", "Concluir e passar adiante". Mensagens descritivas usam "você": _"Apenas membros desta ilha podem dar check-in."_ Não use `tu`, não use `nós`.
- **Sem ponto final em label curta** ("Nome", "E-mail", "Senha"). Com ponto final em frase descritiva ("Acessa o arquipélago de ilhas.").
- **Reticências em estados de loading:** "Entrando…", "Criando…", "Cadastrando…" (uma palavra + reticência, sempre).
- **Vocabulário do domínio:** Use "ilha", "arquipélago", "demanda", "etapa", "check-in" literalmente. Não substitua por "fase", "task", "ticket".
- **Mensagens de erro:** curtas, em vermelho coral, começando com a ação que falhou: _"Erro ao criar."_, _"Erro no check-in."_
- **Confirmações destrutivas:** explicam o que apaga e avisam que é irreversível. Ex: _'Apagar "Login social"? Isso remove a demanda, etapas e anexos. Não dá pra desfazer.'_
- **Estado vazio:** itálico cinza-azulado. _"Nenhuma demanda ainda."_, _"Ninguém atribuído ainda."_, _"Nenhum anexo ainda."_
- **Emoji:** mínimo. Só funcionais nos anexos: 📎 para arquivo, 🔗 para link. **Não** usar emoji decorativo, em headings, em botões.
- **Símbolos de status:** ✕ para fechar, ✓ para concluído, × (multiplicação) para deletar chip. Sem ícone para o estado "pendente" (só uma pill cinza).
- **Pluralização manual:** _"{n} pessoa"_ / _"{n} pessoas"_, _"1 anexo"_ / _"N anexos"_.

**Exemplos canônicos** (copiar à risca):
- CTA login: `Entrar`
- Subtítulo do login: `Acessa o arquipélago de ilhas.`
- CTA criar demanda: `+ Criar`
- CTA check-in: `Concluir e passar adiante`
- Tooltip de hover de ilha: lista de pessoas com seu role abaixo do nome
- Empty state arquipélago: `Sem demanda selecionada — passe o mouse pra ver quem está em cada ilha.`

---

## VISUAL FOUNDATIONS

### Paleta

**Fundo (céu)** — gradient diagonal de `#dbeafe` (azul-céu bem claro) → `#bae6fd` (mid sky) → `#e0f2fe` (céu pálido no horizonte). Sutis nuvens brancas como `radial-gradient` muito difusos. Sem estrelas (era do tema noturno).

**Azul oceano (primária neutra)** — usado em ink, bordas, ícones, hover de chip:
- `#075985` (oceano profundo, ink primário sobre fundo claro)
- `#0369a1` (oceano médio, ink-2)
- `#0284c7` (céu vivo, links e foco)
- `#38bdf8` (céu claro, badges)
- `#7dd3fc` (espuma)
- `#bae6fd` (céu pálido)

**Coral / sol (acento quente)** — botões primários, destaques, chip "ativa":
- `#fb923c` (coral claro, hover)
- `#f97316` (coral, primária CTA)
- `#ea580c` (coral profundo, press)

**Tints das ilhas** (mantém identidade de cada uma, mas reduzidas em saturação para casar com o céu):
- Bruna (origem): violeta-quente `#a78bfa`
- Design: turquesa `#22d3ee`
- Dev A: azul-real `#3b82f6`
- Dev B: índigo `#6366f1`
- Integração: âmbar `#f59e0b`

**Semânticas:**
- Sucesso (concluída): `#10b981`
- Erro: `#ef4444` sobre `rgba(239,68,68,0.10)`
- Aviso/Pendente: cinza-azulado `#94a3b8`
- Em andamento (ativa): **coral** `#f97316` (não roxo)

**Inks:**
- ink-1: `#0c1f3a` (azul-marinho quase preto, body)
- ink-2: `#334e74` (azul-aço, secundário)
- ink-3: `#64748b` (cinza-azulado, terciário)
- ink-soft: `rgba(12,31,58,0.55)` (placeholders, labels)
- ink-inverse: `#ffffff` (sobre coral, sobre fotos)

### Tipografia

- **Display / heading:** `Plus Jakarta Sans` (700/600) — friendly, slightly geometric, casa com a vibe ilustrada das ilhas. _Substituição em relação ao original (que usava só Inter); ver "Substituições" abaixo._
- **Body / UI:** `Inter` (400/500/600) — herdado do legado, mantido.
- **Mono:** `JetBrains Mono` — para `<pre>` de observações, IDs.
- **Tamanhos canônicos:** 11px micro-label uppercase, 12px caption, 13–14px body, 16px ênfase, 22px section h2, 26px page h1, 32px+ para hero/auth.
- **Letter-spacing:** uppercase micro-labels com `0.8–1.2px`; corpo neutro.
- **Numerais:** tabular nos badges de contagem (`font-variant-numeric: tabular-nums`).

### Espaçamento e raios

Sistema base **4px**. Tokens em uso: 4, 6, 8, 10, 12, 14, 18, 22, 26, 30, 36, 48, 64.

**Cantos** (mais arredondados do que o legado, conforme pedido):
- `--radius-pill: 999px` — chips, status pills, badges
- `--radius-sm: 14px` — inputs, botões compactos
- `--radius-md: 22px` — botões grandes, member chips, cards pequenos
- `--radius-lg: 28px` — cards de demanda, glass panels normais
- `--radius-xl: 36px` — **modais, janelas flutuantes, painéis grandes** (essa é a regra do "bem arredondado")

### Background, padrões e textura

- **Fundo principal:** gradient diurno de céu (descrito acima). Sem grain, sem ruído.
- **Nuvens:** 3–4 radial-gradients brancos muito difusos (`blur` implícito pelo gradient soft), opacidade 0.4–0.6, fixos com `background-attachment: fixed`.
- **Sem padrões repetitivos.** Sem textura de mosaico. Sem linhas. O charme vem das ilustrações PNG.
- **Imagens:** as ilustrações de ilha (`assets/islands/*.png`) são **full-bleed contra o fundo** (sem moldura), com um glow radial sob cada uma na cor do tint da ilha. Sem cards ao redor — a ilha **é** o "card".

### Glassmorphism (atualizado)

Vidro continua sendo a linguagem das janelas flutuantes, mas agora sobre céu claro:
- `background: rgba(255, 255, 255, 0.55)`
- `backdrop-filter: blur(24px) saturate(140%)`
- `border: 1px solid rgba(255, 255, 255, 0.85)` (highlight branco no topo)
- `box-shadow: 0 24px 60px -20px rgba(7, 89, 133, 0.25)` (sombra azul-céu suave, não preta)
- `inset 0 1px 0 rgba(255,255,255,0.9)` para o lustre superior

### Sombras

Toda sombra é **azul** (oceano com baixa opacidade), nunca preta neutra:
- `--shadow-sm: 0 4px 12px -2px rgba(7, 89, 133, 0.12)`
- `--shadow-md: 0 12px 28px -8px rgba(7, 89, 133, 0.18)`
- `--shadow-lg: 0 24px 60px -20px rgba(7, 89, 133, 0.25)`
- `--shadow-coral: 0 12px 28px -8px rgba(249, 115, 22, 0.45)` — exclusiva de botão primário coral

### Estados

- **Hover botão primário:** clareia (`#f97316` → `#fb923c`) + `translateY(-1px)`. Sombra coral intensifica.
- **Hover chip / ghost:** muda fundo de `rgba(255,255,255,0.4)` → `rgba(255,255,255,0.7)`. Sem translate.
- **Hover ilha:** `translateY(-8px) scale(1.03)` em 250ms cubic-bezier(0.2, 0.8, 0.2, 1) + popover de membros aparece.
- **Press / active:** `scale(0.98)`. Coral fica `#ea580c`.
- **Focus:** ring duplo — `0 0 0 3px rgba(249,115,22,0.25)` em torno do input + borda em `#f97316`. Foco sempre coral (não azul) para manter contraste com fundo azul.
- **Disabled:** `opacity: 0.5`, cursor `not-allowed`. Sem mudança de cor.
- **Bloqueada (ilha pendente):** `opacity: 0.42`, `filter: saturate(0.45) brightness(0.95)`. Animação `float` pausada. Cursor `help`.

### Animação

- **Easing padrão:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (rápido na saída, suave na chegada — "soft pop").
- **Duração padrão:** 180ms (UI), 250ms (cards/ilhas), 7s (loop `float` das ilhas).
- **Float das ilhas:** `translateY(-10px)` ↔ `0`, infinito, com variante `float-alt` defasada para Dev B.
- **Fade do modal:** 200ms easeOut do backdrop. Modal entra com `scale(0.96) → 1` em 220ms.
- **Sem bounces exagerados.** Sem rotações decorativas. A animação é discreta — flutua, não dança.

### Layout

- **Página máxima:** `1500px` centralizado, `padding: 28px 36px 80px`.
- **Top-strip:** grid de duas colunas (`1fr auto`) — lista de demandas + bloco "Nova demanda".
- **Arquipélago:** grid de 4 colunas em desktop (Bruna | Design | Dev A+B empilhadas | Integração) com uma linha horizontal sutil no meio simbolizando o mar.
- **Brand fixa:** top-left, `position: fixed`.
- **User badge fixa:** top-right, `position: fixed`, com `border-radius: 999px`.
- **Modal:** centralizado, max-width 640px, max-height 88vh, `border-radius: 36px`.

### Transparência e blur — quando usar

- **Use vidro** em qualquer superfície flutuante: top-strip, archipelago section, modal, user badge, popover de membros.
- **Não use vidro** em inputs (eles ganham fundo branco quase opaco para legibilidade), em chips de status (fundo sólido tintado), em botões primários (sólidos).

### Bordas

- Glass: borda branca de 1px com `inset` highlight superior (lustre).
- Inputs e chips ghost: `1px solid rgba(7,89,133,0.15)` (azul-oceano translúcido).
- Botão primário: sem borda — só sombra coral.
- Botão ghost / secundário: borda fina coral `1px solid rgba(249,115,22,0.4)`.

### Cards

Não existem "cards" autossuficientes neste design — o que parece card é sempre **glass-panel**. Característica:
- Cantos de pelo menos 22px (médio) ou 28–36px (grande)
- Vidro branco semi-transparente
- Sombra azul difusa
- Sem borda colorida no canto esquerdo (anti-padrão)
- Para destaque, mudar `background` para tint coral/azul muito diluído, nunca para colorido sólido

---

## ICONOGRAPHY

O produto **quase não usa ícones**. A linguagem visual é movida pelas **ilustrações das ilhas** (PNGs grandes), e o restante da UI conta com texto explícito.

- **Ilustrações de ilha:** 5 PNGs em `assets/islands/`, estilo fantasy/sci-fi 3D, fundo transparente. Cada ilha tem temática própria (Bruna = torre coletora de demandas mágicas; Design = montanhas coloridas com pincéis; Dev = ferramentas + circuitos; Integração = arquipélago menor convergindo). **Nunca substituir por SVG hand-rolled ou emoji.**
- **Emoji funcionais** (mantidos do original): `📎` arquivo, `🔗` link, `✕` fechar modal, `✓` check de etapa concluída, `×` deletar chip, `+` criar.
- **Símbolos Unicode** acima são o sistema de ícones de UI completo do produto. Não há lib de ícones (Lucide, Heroicons etc.) instalada no codebase.
- **Brand mark:** ponto coral-laranja de 8–10px (`brand-dot`) seguido do wordmark "Sistema de Ilhas". O ponto era um `linear-gradient` rosa→violeta; agora é coral sólido com glow coral.
- **Avatares:** o backend tem `avatar_url`, mas a UI atual mostra apenas iniciais/nome em texto. Mantido — não inventar avatares se não houver imagem.

Se for **necessário** adicionar ícones a uma nova tela (settings, navegação, etc.), use **Lucide** via CDN (`https://unpkg.com/lucide@latest`) com `stroke-width: 1.75`, cor `#0c1f3a`, tamanho 18–20px. Esta é uma **substituição flagada** — não está no codebase original; documente sempre que usar.

---

## Fontes utilizadas — substituições

O codebase original referencia **Inter** mas não inclui o arquivo (depende do system stack). Adicionamos via Google Fonts:

- **Inter** (variável) → Google Fonts ✅ (sem mudança de identidade)
- **Plus Jakarta Sans** (variável) → Google Fonts ⚠️ **adição** — sugerida como display porque case com o tom amistoso/ilustrado. Se você preferir manter só Inter, troque `--font-display` para `--font-body` em `colors_and_type.css`.
- **JetBrains Mono** → Google Fonts ⚠️ **adição** — substitui o fallback genérico `monospace`. Usada apenas em `<pre>` de observações.

Se você tiver arquivos `.woff2` proprietários para essas famílias, coloque em `fonts/` e ajuste os `@font-face` no topo de `colors_and_type.css`.

---

## Manifesto deste folder

| Arquivo / pasta | O que é |
|---|---|
| `README.md` | Este arquivo. Visão geral, paleta, tom, decisões. |
| `colors_and_type.css` | Tokens canônicos (vars CSS) — cores, tipografia, espaçamento, raios, sombras. Importar em qualquer artefato. |
| `SKILL.md` | Instruções para outro agente reusar este sistema. |
| `assets/islands/` | 5 PNGs das ilhas (bruna, design, dev_a, dev_b, integracao). |
| `preview/` | Cards HTML que populam o painel "Design System". Um por sub-conceito. |
| `ui_kits/web_app/` | Recriação visual em React/JSX do app: dashboard, login, modal de ilha, etc. |

