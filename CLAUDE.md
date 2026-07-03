# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Organisation

Monorepo for multiple independent web projects. Each project lives in its own subfolder:

```
allprojectsClaude/
├── tarot-oracle-sbp.html  ← Tarot oracle (single-file, standalone)
├── bot/                   ← Telegram bot for the Tarot oracle
├── 333/                   ← Computer club kk333.ru website
├── fitness/               ← Fitness studio "Bloom" landing page
├── brucup/                ← BruCup Coffee landing page (Stavropol)
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

---

## Project 4 — Fitness Studio "Bloom" (`fitness/`)

Landing page for a women's fitness studio in light, gentle pastel tones (cream / soft rose / sage). Single self-contained file `fitness/index.html` (inline CSS + JS), Russian language, no build step — open directly in a browser.

**Design system** (CSS variables in `:root`): `--bg` cream #faf6f2, `--rose-deep` #c98a7d (primary accent / buttons), `--sage-deep` #7fa089 (secondary), fonts Cormorant Garamond (headings) + Manrope (body).

**Page sections** (in order): Hero → Marquee → Программы (#programs, 6 cards) → Почему мы (#why) → Тренеры (#trainers) → Расписание (#schedule, table) → Цены (#prices, 3 plans) → Отзывы (#reviews) → FAQ (#faq, `<details>`) → CTA (#cta) → Контакты (#contacts)

**JS interactions** (inline script): scroll reveal (`.reveal` → `.is-in`), sticky header, scroll-spy nav, animated counters (`[data-count]`), mobile burger menu. All honour `prefers-reduced-motion`.

**Placeholders to replace with real data:** phone `+7 999 000-00-00` / `wa.me/79990000000`, address «ул. Цветочная, 12», Telegram/VK/map links (`href="#"`), trainer names, schedule, prices.

---

## Project 5 — BruCup Coffee (`brucup/`)

Editorial-cinematic landing page for the **BruCup Coffee** coffee shop in Stavropol. Single self-contained file `brucup/index.html` (inline CSS + JS), Russian language, no build step — open directly in a browser. Design is a deliberate blend of two real Russian coffee sites used as references — **Etlon Coffee** (etlon.ru) and **Baggins Coffee** (bagginscoffee.com), both built on Tilda — with the motion vocabulary studied from their Zero Block animation data-attributes. **Intentionally NOT a reskin of `333/`** (an earlier draft was and got rejected); do not fall back to the neon-on-black gaming-club look.

**Design system** (CSS variables in `:root`): two-tone — dark espresso `--ink` #140f0b (hero, CTA band, footer) alternating with warm cream `--cream` #f5eee2 / `--cream-2` (editorial body), caramel accent `--amber` #d5813b (+ `--amber-deep`, `--amber-soft`). Fonts **Oswald** (condensed uppercase display, Cyrillic — the Etlon "Muller" stand-in, skewed `-7deg` for the italic slant) + **Manrope** (body). Signature easing `--ease: cubic-bezier(.16,1,.3,1)`.

**Reference-derived elements (reinterpreted, not copied):**
- Cinematic dark hero (Etlon): type-forward, huge `#heroTitle` with a filled line + outline line (`-webkit-text-stroke`), tagline «ЦЕНИМ КАЖДЫЙ ГЛОТОК»; warm out-of-focus "coffee photo" backdrop faked with layered radial gradients + SVG grain + vignette, animated by a slow **Ken-Burns** zoom (`@keyframes kenburns`, ~22s).
- **Ribbon** kinetic headers (Etlon): `.ribbon__track` marquee mixing filled + `.out` outline words with amber `/` separators; `--rev` variant reverses direction.
- Product-forward drink cards (Baggins): `.drink` with SVG drink art on a warm radial glow, **zoom-in reveal** (`.rv-z`) + hover tilt.
- Floating pill navbar (Baggins): `#nav .nav__pill`, a solid cream pill carrying the **brand logo mark** (orange rounded-square coffee-lid `.brand` SVG, recreated from the real BruCup logo) + condensed wordmark; `.is-stuck` deepens the shadow on scroll.
- Dark editorial footer (Etlon): horizontal nav + phone/hours + legal + Meta disclaimer.
- 3D depth kept tasteful: pointer + scroll **parallax** on `[data-depth]` layers (beans, cup) via one rAF loop, hero title scroll parallax/fade; **no** neon orbits, steam, or perspective grid from the old draft.

**Brand-specific animation additions:**
- **Preloader** (`#loader`): on every launch, coffee pours along an S-shaped path (`#pourPath`, drawn via `getTotalLength` + `stroke-dashoffset` transition) into an open SVG BruCup cup, the coffee surface fills (`.ld__coffee` scale-up), then a white **lid drops and seats** on top (`.ld__lid`), steam puffs, and the overlay fades. Click-to-skip; hidden entirely under `prefers-reduced-motion`.
- **Branded cup SVG** recreated from the real product photo (rust-orange body `#b5501f`, white lid, ring logo mark, "BRUCUP COFFEE", S/M/L/XL) — defined once as `<symbol id="cupArt">` and reused as **45°-tilted decorative `.side-cup`s** down the edges of the cream sections (#about, #features, #reviews, #prices, #contacts). They **rise on scroll + get a springy jerk** from scroll velocity (computed in the parallax rAF loop); base tilt via `--rot` so reduced-motion still shows them angled. Hidden below 600px.
- **No custom cursor** — uses the native OS cursor (the earlier blend-mode cursor was removed).

**Motion vocabulary** (measured from the reference Tilda blocks): Etlon = slow ~2.7s fade-in-from-right/fade + Ken-Burns zoom, block-into-view stagger; Baggins = faster ~1s fade-in-down + zoom-in "pop". BruCup synthesises this as ~1.1s expo reveals (`.rv`, directional `.rv-r`/`.rv-l`/`.rv-z`) with per-batch stagger in the IntersectionObserver.

**Page sections** (in order): Hero (#hero) → ribbon → О нас (#about, lead statement + 5 count-up stats) → Фичи (#features, 6-card editorial grid) → ribbon → Меню/примеры (#menu, 4 drink cards) → Отзывы (#reviews, 6 cards) → Цены (#prices, 3 menu columns, dark "Авторское" column) → FAQ (#faq, `<details>`) → CTA (dark band) → Контакты (#contacts, 2 locations) → dark Footer

**Real business data** (from Yandex Maps / 2GIS):
- Location 1: ул. Тухачевского, 27/4 (ЖК «Новороссийский») — [Yandex](https://yandex.ru/maps/org/bru_cup_coffee/5981794537/), [2GIS](https://2gis.ru/stavropol/firm/70000001059461555)
- Location 2: ул. Тухачевского, 31 к1 (ЖК «Квартал 17/77») — [2GIS](https://2gis.ru/stavropol/firm/70000001090719717)
- Phone: +7 961 499-90-80 · Hours: daily 07:00–23:00 · Rating 4.9 (1200+ reviews)
- Instagram: [@bru_cup_coffee](https://www.instagram.com/bru_cup_coffee/) (footer carries the required Meta disclaimer)

**Approximate content to verify with the owner:** menu prices in #menu/#prices, review texts (marked as "собирательные" on the page), drink lineup.

**JS interactions** (inline script, fresh module — not adapted from `333/`): preloader control, floating-pill nav shadow state, single-rAF parallax controller (`[data-depth]` hero layers + hero title + `.side-cup` scroll-jerk), expo scroll reveals with per-batch stagger, count-up stats, subtle tilt on `[data-tilt]`, mobile burger menu. Ken-Burns + ribbon marquee + preloader lid/fill are CSS-driven. All honour `prefers-reduced-motion`.
