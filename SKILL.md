---
name: sistema-ilhas-design
description: Use this skill to generate well-branded interfaces and assets for Sistema de Ilhas, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What's in this skill

- `README.md` — the master document. Read first. Contains: product summary, content tone rules, visual foundations (colors, type, spacing, radii, shadows, glass, motion), iconography rules, font substitutions made.
- `colors_and_type.css` — all design tokens as CSS custom properties. Import as `@import url("…/colors_and_type.css")` and use vars: `--sky-*`, `--coral-*`, `--ink-*`, `--tint-*`, `--radius-*`, `--shadow-*`, `--space-*`, `--font-display`, `--font-body`. Pre-defined utility classes: `.glass`, `.ds-h1`, `.ds-pill`, etc.
- `assets/islands/` — five PNG illustrations (`bruna.png`, `design.png`, `dev_a.png`, `dev_b.png`, `integracao.png`). Always reference these from disk; never redraw them.
- `preview/` — small HTML cards demonstrating each token group. Useful as visual reference.
- `ui_kits/web_app/` — full React/JSX recreation of the product (login, register, dashboard with archipelago, island modal). Copy these components when building anything resembling the real product.

## Quick rules to remember

1. **Background is sky, not space.** Use `var(--bg-gradient)` (or copy the radial+linear gradient stack from `colors_and_type.css`) — never dark backgrounds.
2. **Primary action = coral**, not blue/purple. `var(--coral-500)` with `var(--shadow-coral)`.
3. **Floating windows have *very* rounded corners.** Modals: 36px. Cards: 28px. Buttons: 22px. Inputs: 14px. Pills: 999px.
4. **Sombras are sky-tinted**, never neutral black. Use `var(--shadow-md/lg/xl)`.
5. **Glass surface = white at 55–72% opacity** with `backdrop-filter: blur(24px) saturate(140%)` and a 1px white border.
6. **Type:** Plus Jakarta Sans (display, 700/800), Inter (body/UI), JetBrains Mono (only inside `<pre>` blocks). All from Google Fonts — already imported by `colors_and_type.css`.
7. **Copy is PT-BR, casual.** Use "demanda", "ilha", "check-in", "arquipélago" literally. Sentence case. Reticências (`…`) on loading states.
8. **No invented icons.** Use the unicode set `📎 🔗 ✕ ✓ × +`. If you must add icons, use Lucide via CDN at stroke-width 1.75 and flag the addition.
9. **Island PNGs are the brand.** Don't hand-draw SVG replacements. Place them on a radial-gradient glow tinted with the island's color.
10. **No bluish-purple gradients, no emoji decoration, no left-border accent cards.** These were not in the source brand.

## Common tasks

- **New screen in this product** → start by importing `colors_and_type.css` and `ui_kits/web_app/styles.css`. Reuse `Topbar`, `Brand`, `Field`, `Button` from `Primitives.jsx`.
- **Marketing slide / one-pager** → use the sky gradient as background, the brand mark in the corner, and at least one island PNG as a hero element. Coral CTAs.
- **New variant of an existing component** → fork the JSX, keep the class names so the existing CSS still applies, only tweak the new bits.
