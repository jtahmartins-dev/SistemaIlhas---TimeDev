# UI Kit — Sistema de Ilhas (web app)

Recriação visual da app Next.js original (`SistemaIlhas/frontend/`) com o novo tema **céu azul + coral**.

## Como abrir
- Abra `index.html` no preview. Babel transpila os JSX inline.
- Tudo é mock: o login aceita qualquer e-mail/senha e te coloca como Bruna; "Cadastrar" também só simula. Use o login direto para ver o dashboard cheio.

## Estrutura

| Arquivo | O que faz |
|---|---|
| `styles.css` | CSS completo do app (substitui `globals.css`). Importa `colors_and_type.css` do root. |
| `Primitives.jsx` | `Button`, `Field`, `StatusPill`, `Brand`, `Topbar`. Pequenos blocos compartilhados. |
| `Island.jsx` | Card de ilha flutuante com PNG, animação `float`, glow tingido, popover de membros. |
| `IslandModal.jsx` | Modal de detalhes da ilha (cantos de 36px, glass-xl) com anexos e check-in. |
| `AuthScreens.jsx` | `LoginScreen` + `RegisterScreen`. |
| `Dashboard.jsx` | Top-strip de demandas + form de nova demanda + arquipélago. Lógica de fluxo entre ilhas. |
| `App.jsx` | Router simples (`login` / `register` / `dashboard`) + dados-semente. |
| `index.html` | Entry point. Carrega React, Babel e os scripts acima. |

## Componentes principais

- **Island** — `ilha`, `etapa`, `bloqueada`, `alternate`, `onClick`. Renderiza um PNG de `assets/islands/<slug>.png`, com glow radial atrás, animação de flutuação e popover dos membros no hover.
- **IslandModal** — modal glass-xl (radius 36px) com pessoas, estado da etapa, lista de anexos, e CTAs de "anexar link" / "concluir e passar adiante" (check-in).
- **Topbar** — brand-dot coral fixo no canto top-left + cápsula com nome do usuário + role + botão "Sair" no top-right.
- **Demanda chip** — pill arredondada; ativa vira gradient coral.
- **Status pill** — texto micro-uppercase com fundo tingido pela cor semântica.

## Fluxo simulado

1. Logue (qualquer e-mail). Você vira "Bruna Pereira" com role `bruna`.
2. Veja as 3 demandas pré-carregadas. Clique nas pills para alternar.
3. Clique numa ilha → abre modal. Se você é da ilha + a etapa está `ativa`, pode dar check-in.
4. Como Bruna, você pode dar check-in na ilha **Bruna** (a primeira). Isso desbloqueia Design.
5. Para testar as outras ilhas: clique "Sair" → "Cadastrar" → escolha role/ilha diferente → continue o fluxo.

## O que **não** foi recriado (intencionalmente)

- Conexão real ao backend FastAPI — tudo em memória.
- Upload real de arquivo — o handler está stubado.
- Validação de senha / e-mail duplicado.
- Persistência: ao recarregar a página, tudo volta ao estado inicial.
