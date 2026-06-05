# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Organisation

Monorepo for multiple independent web projects. Each project lives in its own subfolder:

```
allprojectsClaude/
├── tarot-oracle-sbp.html  ← Tarot oracle (single-file, standalone)
├── 333/                   ← Computer club kk333.ru website
└── CLAUDE.md
```

**Starting a new project:** the "+" button in Claude Code on the web opens a new *session*, not a new folder. To add a project, ask Claude to create a subfolder with the required files. For a completely separate repository, create it on GitHub first, then select it when starting a session.

---

## Project 1 — Tarot Oracle (`tarot-oracle-sbp.html`)

Russian-language Tarot oracle SPA. No build system, no framework — open directly in a browser.

**Architecture** (all inline in one HTML file):
- `MAJOR` / `SUITS` / `RANKS` / `MINOR` — card data (78 cards total)
- `buildDeck()` — assembles full deck at startup
- `SPREADS` — 3 spread types: `day` (1 card), `ppf` (3 cards), `love` (5 cards)
- `drawCards(n)` — Fisher-Yates shuffle + 30% reversed chance
- `interpret()` — generates reading text client-side from cards + spread + user question
- Hash-based SPA: `go(view)` toggles `.on` on `#view-{name}` sections
- `localStorage` key `oracle_history_v1` (last 50 readings); falls back to in-memory

**Payment block** — edit `PAY` object near top of `<script>`:
```js
const PAY = {
  mode: "manual",      // "manual" | "backend" | "off"
  price: 150,
  qrImageSrc: "",      // URL or data:image/png;base64,... of QR image
  sbpLink: "",         // deep-link to open bank app (optional)
  backendBase: ""      // for mode:"backend" only
};
```

---

## Project 3 — Telegram Bot (`bot/`)

Minimal Python bot for `@OracleTarot26_bot`. Responds to `/start`:
- **New user** → sends inline `web_app` button that opens the Tarot app directly
- **Returning user** → reminds to use the Menu Button

**Run locally:**
```bash
cd bot
pip install -r requirements.txt
cp .env.example .env        # fill in BOT_TOKEN and WEB_APP_URL
export $(cat .env | xargs)
python bot.py
```

**Environment variables** (never commit to git):
- `BOT_TOKEN` — token from BotFather
- `WEB_APP_URL` — HTTPS URL of the deployed tarot app

`greeted_users.json` is created automatically at runtime to persist first-visit tracking across bot restarts. It is git-ignored.

---

## Project 2 — Computer Club 3/33 (`333/`)

Landing page for gaming club **3/33** in Stavropol (kk333.ru). Pure static site, no build step.

**Contacts & booking:**
- Phone / WhatsApp: +7 918 742-00-33
- Telegram: @kk333stv | VK: vk.com/club228243290
- Address: Ставрополь, ул. Пирогова 15/1, цокольный этаж
- All booking buttons link to `https://wa.me/79187420033`

**File structure:**
```
333/
├── index.html          ← main page (loads external CSS/JS)
├── kk333.html          ← self-contained version (CSS inlined, no external deps)
├── assets/
│   ├── css/styles.css  ← all styles
│   ├── js/main.js      ← interactions (cursor, tilt, counters, scroll-spy, menu)
│   └── favicon.svg
└── serve.ps1           ← local dev server (PowerShell, port 5733)
```

**Two HTML files:** `index.html` uses external assets; `kk333.html` is fully self-contained (CSS inlined). **Both must be kept in sync** when making content or style changes.

**Page sections** (in order): Hero → Marquee → Акции (#offers) → Почему 3/33 (#why) → Зоны (#zones) → Железо (#tech) → Отзывы (#reviews) → Цены (#prices) → Бронь (#how) → FAQ (#faq) → CTA → Контакты (#contacts)

**8 gaming zones:** Standart (RTX 4060 Ti) → Squadroom (RTX 4070 Ti, 5 PCs) → Arena (RTX 4070 Ti S) → BootCamp (RTX 4070 Ti S) → Duo 51–52 (OLED 240Hz) → Duo 53–54 (500Hz) → Ultra Duo (RTX 5080, flagship) → PlayStation (PS5, 6 seats, TCL 65″)

**JS interactions** (`main.js`):
- Custom cursor with hover/click states (desktop only, `finePointer` check)
- Magnetic elements (`[data-magnetic]`) — pull toward cursor
- Tilt cards (`[data-tilt]`) — subtle 3D on hover
- Scroll reveal (`.reveal` → `.is-in` via IntersectionObserver)
- Animated stat counters (`[data-count]`)
- Sticky header + scroll-spy active nav
- Mobile burger menu
- Parallax on `.bg__glow` and `[data-parallax]`

**Local dev:** run `serve.ps1` in PowerShell → opens `http://localhost:5733`

**Note:** `chat-history/` is git-ignored (large JSONL session logs, local only).
