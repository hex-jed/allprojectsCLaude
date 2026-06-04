# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file Russian-language Tarot oracle web app (`tarot-oracle-sbp.html`). No build system, no framework, no npm — open the file directly in a browser to run it.

## Architecture

The entire app lives in one HTML file with inline CSS and JavaScript. Key sections within the `<script>` block:

**Data layer**
- `MAJOR` — 22 Major Arcana cards (name, emoji, keyword, upright/reversed meanings)
- `SUITS` + `RANKS` + `MINOR` — 56 Minor Arcana across 4 suits (Wands/Cups/Swords/Coins)
- `buildDeck()` — assembles the full 78-card `DECK` array at startup

**Spread engine**
- `SPREADS` — 3 spread types: `day` (1 card), `ppf` (3 cards), `love` (5 cards); each has `positions[]` labels
- `drawCards(n)` — Fisher-Yates shuffle + 30% reversed chance
- `interpret()` — generates reading text from cards + spread positions + user question; runs entirely client-side

**Payment block**
- `PAY` config object at the top of `<script>` — edit `mode`, `price`, `qrImageSrc`, `sbpLink`, `backendBase`
- `mode: "off"` disables payment; `"manual"` shows a static QR; `"backend"` polls `{backendBase}/create-payment` and `{backendBase}/payment-status`

**Routing**
- Hash-based SPA: `go(view)` toggles `.on` class on `#view-{name}` sections
- Views: `home`, `spread`, `deck`, `history`, `about`, `contacts`

**Persistence**
- `localStorage` key `oracle_history_v1` (last 50 readings); falls back to in-memory array if storage is unavailable

## Repository Organisation

This repo (`allprojectsClaude`) serves as a monorepo for multiple independent projects. Each project lives in its own subfolder:

```
allprojectsClaude/
├── tarot-oracle-sbp.html  ← standalone single-file project (current)
├── project-two/           ← future projects go here as subfolders
└── CLAUDE.md
```

**Starting a new project:** the "+" button in Claude Code on the web opens a new *session*, not a new folder. To add a project, ask Claude to create a subfolder with the required files. For a completely separate repository, create it on GitHub first, then select it when starting a session.

## Payment Configuration

To enable payments, edit the `PAY` object near the top of the `<script>` tag:

```js
const PAY = {
  mode: "manual",      // "manual" | "backend" | "off"
  price: 150,
  qrImageSrc: "",      // URL or data:image/png;base64,... of your bank's QR
  sbpLink: "",         // optional deep-link to open bank app
  backendBase: ""      // for mode:"backend" only
};
```
