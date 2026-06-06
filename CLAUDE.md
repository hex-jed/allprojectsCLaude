# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file Russian-language landing page for **«3/33» computer (e-sports) club** in Stavropol
(`kk333.html`). No build system, no framework, no npm — open the HTML file directly in a browser to run it.

The page sells gaming sessions: 60 PCs, PlayStation 5, 8 gaming zones, top-tier hardware
(RTX 5080, Ryzen 9 9800X3D, monitors up to 500 Hz), open 24/7. The primary conversion action is
booking via WhatsApp / phone.

### Variants (selling-structure rebrand)

Three HTML files coexist; each is fully standalone:

| File | What it is |
|------|------------|
| `kk333.html`    | Original site (base). |
| `kk333-v1.html` | **Variant 1** — same brand identity (name 3/33, dark + emerald/teal palette, Manrope/Space Grotesk type), content restructured to a classic selling-landing flow. |
| `kk333-v2.html` | **Variant 2** — a from-scratch, deliberately different design that reuses the base's **dark + emerald/teal** palette but as a **multi-page single-file SPA**: a fixed left sidebar (dashboard style) with hash-routed pages — Главная `#home`, Зоны `#zones`, Цены `#prices`, О клубе `#about`, Контакты `#contacts`. Type Sora + Inter + JetBrains Mono. No orb, no custom cursor, no preloader. Degrades gracefully: without JS every page is shown as one long scroll (a `.js` class gates the routing). |

The selling structure of the base / Variant 1 follows:
**Hero (USP + product + CTA) → brand strip → Problem→Solution → Benefits →
Zones (catalogue) → Hardware → Prices → Offers → Reviews → Guarantees →
How-to-book → FAQ → final CTA with a limited offer + countdown → Contacts.**

## Architecture

Everything lives in one HTML file with inline CSS and JavaScript. The notes below
describe the **base / Variant 1** engine. `kk333-v2.html` is a standalone redesign:
same single-file approach and same emerald palette, but a multi-page SPA with a
sidebar + hash router (`location.hash` toggles `.page.is-active`), its own component
set (`.zone`, `.price`, `.offer`, `.card`), and a light JS (router + mobile menu +
year, no cursor/orb/parallax/preloader). Pages render as one scroll when JS is off.

**CSS**
- Design tokens in `:root` — surfaces, brand accents (`--acc`, `--acc-2`, `--acc-3`, `--acc-deep`),
  text, lines, gradients, radii, fonts. Most colours flow from these variables.
- Some accent colours are also hard-coded as raw RGB triplets in `rgba(...)` (e.g. `rgba(27,186,152,.16)`).
  A palette swap therefore means changing both the `:root` hex values **and** those raw RGB triplets
  (this is exactly how `kk333-v2.html` was produced from `kk333-v1.html`).
- Sections are class-driven (`.hero`, `.section--problem`, `.zones`, `.tech`, `.prices`,
  `.guarantees`, `.cta`, …) with reveal-on-scroll (`.reveal`) and responsive breakpoints at 1024 / 780 / 560 px.

**JavaScript** (single IIFE at the bottom, progressive-enhancement, respects `prefers-reduced-motion`)
- `initCursor` — custom cursor that stays glued during scroll
- `initMagnetic` / `initTilt` — pointer-driven button & card micro-interactions
- `initReveal` — IntersectionObserver fade-in
- `initCounters` — animated hero stat counters (`[data-count]`)
- `initHeader` — sticky header + scroll-spy active nav
- `initMenu` — mobile burger menu
- `initParallax` — background-glow / hero parallax
- `initMisc` — footer year + preloader
- `initCountdown` — evergreen countdown to end of month for the final limited offer (`#countdown`)

**No persistence, no backend** — it's a static marketing page. All CTAs are `wa.me` / `tel:` links.

### Editing the palette (base / Variant 1)

The dark emerald palette of `kk333.html` / `kk333-v1.html` is driven by `:root`
plus some raw RGB triplets hard-coded in `rgba(...)`. To recolour:

1. Change the `:root` accent hex values (`--acc`, `--acc-2`, `--acc-3`, `--acc-deep`, `--acc-glow`).
2. Global-replace the matching raw RGB triplets in `rgba(...)` across the file
   (emerald set is `27,186,152` / `0,212,167` / `30,214,175` / `18,135,120`).
3. Swap the Google Fonts `<link>` + `--font` / `--font-disp`.
4. Update the favicon data-URI colours and `<meta name="theme-color">`.

`kk333-v2.html` has its own flat token set (`--paper`, `--ink`, `--lime`, `--blue`,
`--coral`) and is recoloured just by editing those `:root` values.

## Repository Organisation

This repo (`allprojectsClaude`) serves as a monorepo for multiple independent projects.
Standalone single-file projects can live in the repo root; larger projects get their own subfolder:

```
allprojectsClaude/
├── kk333.html       ← 3/33 club landing — base
├── kk333-v1.html    ← Variant 1 (brand kept + selling structure)
├── kk333-v2.html    ← Variant 2 (visual rebrand + selling structure)
└── CLAUDE.md
```

**Starting a new project:** the "+" button in Claude Code on the web opens a new *session*, not a new
folder. To add a project, ask Claude to create the file(s) here. For a completely separate repository,
create it on GitHub first, then select it when starting a session.
