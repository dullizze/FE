# Dullizze Design System

> **Dullizze (둘리즈)** — a subscription web SaaS that turns a one-line
> Korean topic into a 9:16 YouTube Short: it auto-generates the script,
> voice, visuals, captions and music, then lets the user review and publish
> the result. Target users are **non-developers using only a browser**, so
> the UI must be in Korean, simple, and forgiving (fast first success,
> friendly waiting states, plain-language errors).

This folder is the **single source of truth** for how Dullizze looks and
sounds. It can be browsed in the Design System tab of this project, copied
wholesale into another project, or downloaded and used as a Claude Agent
Skill (see `SKILL.md`).

---

## Index

| Path | What it is |
|---|---|
| `README.md` | This file — brand context, content rules, visual rules, iconography |
| `SKILL.md` | Agent-Skill front-matter so this folder is invokable as `dullizze-design` |
| `colors_and_type.css` | All CSS variables — colour tokens, type scale, spacing, radius, shadow, motion |
| `assets/` | Logos, hero / template thumbnails, illustrations |
| `fonts/` | (intended for Pretendard + Wanted Sans `.woff2` — currently CDN-loaded; see Caveats) |
| `preview/` | Cards that render in the Design System tab |
| `ui_kits/dullizze-app/` | High-fidelity recreation of the product app surface (`/app/create`, `/app/jobs/[id]`, dashboard…) |
| `source-refs/` | Verbatim copies of the source PRD / FRONTEND.md / AGENTS.md / dashboard prototype |

---

## Sources used to build this

- **GitHub — `gyeongwonKR/dullizze`** (`https://github.com/gyeongwonKR/dullizze`).
  The product's actual repo. Contains `PRD.md`, `FRONTEND.md`, `AGENTS.md`,
  the FastAPI skeleton, the Remotion templates that render the final mp4,
  and `web/dashboard.html` — the internal single-page prototype that this
  system codifies into a real product UI.
- **Wanted Design System** (Korean, open-source Figma community file) —
  named in `FRONTEND.md §1` as the design source of truth for tokens,
  fonts, and the Wanted Sans + Pretendard typography pairing.
- **shadcn/ui (Figma + npm)** — the *code* layer. Every interactive
  component (Button, Input, Select, Tabs, Dialog, Tooltip, Progress,
  Sonner toast) is built from shadcn/ui primitives with the Wanted DS
  tokens applied as the Tailwind theme.
- **Pretendard 1.3.9** (`https://github.com/orioncactus/pretendard`) —
  body font; the de-facto Korean web sans.
- **Wanted Sans 1.0.3** (`https://github.com/wanted-sans/wanted-sans`) —
  display font; the Wanted-team variant of Pretendard with a slightly
  sharper modulation, used for headlines.

Anyone iterating on this system should keep these tabs open. The
PRD/FRONTEND specs ARE the brief — copy and tone in this README is lifted
from them.

---

## Brand at a glance

| | |
|---|---|
| **Name** | Dullizze (Hangul: 둘리즈 — the project is Korean-first) |
| **Mark** | A 26 px rounded square with a 135° gradient `--brand-grad-from` → `--brand-grad-to` (Wanted blue `#0066FF` → violet `#6541F2`) |
| **Primary colour** | **Wanted Blue `#0066FF`** (`color-atomic-blue-50`) — used on every primary CTA, selection, and the brand mark. Hover = `#0054D1` (blue-40). |
| **Voice** | Friendly, plain Korean. Reassuring during long waits. Never developer-facing. |
| **Layout vibe** | shadcn-style: white cards on a cool grey background, 1 px borders, 6–8 px radii, low-contrast shadows. Calm and clerical. |
| **Tagline** | "주제 한 줄, 쇼츠 한 편." ("One line of a topic, one finished Short.") |

---

## CONTENT FUNDAMENTALS

> The whole product ships in **Korean**. English appears only in code,
> debug labels, and the SKILL.md front-matter. The English in this README
> is for designers / agents reading it — it is NOT product copy.

### Voice & tone

- **Friendly senior, not corporate.** Speech-style copy in honorific
  Korean (`해요체` — "…해요", "…돼요", "…했어요"). Never the blunt `한다체`,
  never the casual `반말`.
- **Plain-language everywhere.** A non-developer must understand every
  string without context. We never use English jargon where a Korean word
  exists (`렌더링 중` → `영상 만드는 중`).
- **Reassuring under uncertainty.** Long waits and errors are reframed in
  a calm, "we've got this" tone (PRD §1.5).

### Casing & punctuation

- Sentence-case for everything. No Title Case on buttons.
- Korean punctuation: `?`, `!`, `…`, full-width comma (`,`) and period (`.`).
- Headlines may drop trailing periods.
- Use middle dots `·` for inline lists (`기획 · 음성 · 영상`) — they're
  visually quieter than commas at large type.

### Pronoun & person

- Address the user as **"이번 영상"** / **"이번 달"** or with the implicit
  Korean subject — avoid the literal `당신`. Where a pronoun is unavoidable,
  use `님` after the user's nickname (`소에노님`).
- The product speaks about itself in 1st-person plural only on the landing
  page (`우리가 만들었어요`). Inside the app, the product is invisible —
  it just narrates the user's task (`대본을 쓰는 중이에요`).

### Examples — voice-correct strings from the PRD/FRONTEND

| Surface | String | Why |
|---|---|---|
| Loading state | **"대본 쓰는 중… → 목소리 입히는 중… → 영상 만드는 중…"** | Step-by-step, friendly verbs, no English |
| Empty inbox | **"이런 주제 어때요?"** | Suggests, doesn't command |
| Quota chip | **"이번 달 N편 남음"** | Always visible, never scary |
| Privacy framing | **"비공개로 올라갔어요, 확인 후 공개하세요"** | Calms the YouTube-anxiety user |
| Generic error | **"이미지 생성이 잠시 실패했어요"** + `[다시 시도]` | "잠시" softens; one-click recovery |
| Sample topic | **"클레오파트라는 이집트인이 아니었다"** | Concrete, hook-y, no clickbait |
| Onboarding nag | **"채널 연결은 나중에 해도 돼요"** | Defers OAuth friction |

### Anti-patterns (do NOT write)

- ❌ Stack traces, status codes, or English error names visible to the user
- ❌ "Click here" / "여기를 클릭" — link the verb instead (`영상 만들기`)
- ❌ Exclamation-stacked marketing copy. One `!` per screen max.
- ❌ Emoji. The product uses zero emoji in UI strings (only in `assets/`
  for template-preview thumbnails if we ever ship them).
- ❌ Borrowed English ("크리에이트", "스크립트", "퍼블리시") when a normal
  Korean word fits ("만들기", "대본", "공개").

---

## VISUAL FOUNDATIONS

The product surface is **calm, clerical, and trustworthy** — it has to
host a long-running render job without making the user anxious. We borrow
the shadcn/Wanted aesthetic almost verbatim and then break it only inside
the **video-preview pane**, which lives in its own dark world.

### Colour

- **Primary palette is blue-on-cool-grey.** Wanted Blue (`#0066FF`,
  `color-atomic-blue-50`) is the only colour that lives on CTAs and on the
  brand mark; everything else in the chrome is neutral. We never use the
  accent for body text — it stays a CTA / selection / focus signal.
- **Surfaces.** Page background is `--bg` (`#F4F4F5`, Wanted
  `coolNeutral-98`). Cards sit on top in pure `#FFFFFF` with a 1 px
  `--line` border (`coolNeutral-90`). We never use shadow alone to
  separate a card from the page — there is always a border too.
- **Status colours map 1:1 to job state.** `queued` / `running` → orange
  (`--warning`, `color-atomic-orange-40`); `done` → green (`--success`,
  `green-40`); `failed` → red (`--danger`, `red-40`). These are the ONLY
  semantic colours, and the badge backgrounds are washed-out tints
  (`--*-soft`, the 95-step), never saturated.
- **Template accents are quarantined.** Pop-yellow (`#FFE000`), Banner-
  pink (`#FF4FA3`) and Documentary-black appear inside the video preview
  area or as 36×64 swatches in the "형" (template) picker. They never
  leak into product chrome.
- No gradients in product chrome. The **single exception** is the brand
  mark (Wanted blue→violet, 135°). The video templates use their own protection
  gradients (top/bottom darkening) — those live inside the 9:16 frame
  only.

### Typography

- **Pretendard for body, Wanted Sans for display.** Both are open-source
  Korean sans-serif families with very wide weight ranges. We lock to a
  4-stop weight scale: 400 / 500 / 600 / 700. We never use ExtraBold or
  Black — too tabloid for the product chrome.
- **The video templates use NanumGothic Bold** (per
  `remotion/src/templates/*.tsx`), which is what's installed in the
  Docker render container. NanumGothic only appears in the rendered
  mp4, never in the product UI.
- Type sizes use a 1.125 ratio anchored at body=14 px. Korean is
  generally set 1 px smaller than equivalent Latin copy because Hangul
  has a higher x-height — but we leave 14 px as the minimum.
- `word-break: keep-all` + `line-break: strict` everywhere — Korean must
  break on whitespace, never inside a 어절.

### Spacing & layout

- **4 px base spacing scale.** All paddings and gaps snap to multiples
  of 4. Card interior padding is 18 px (the only off-grid value, lifted
  from the dashboard prototype).
- **Two-column app shell.** Left rail (sticky form / job list, 320–430 px)
  + right pane (preview / detail). Collapses to one column under 900 px.
- **Mobile-first respected.** Non-developers use phones; every primary
  flow (create, review, publish) is reachable on a 360 px viewport.
- **Hit targets ≥ 40 px.** Buttons and inputs are 40 px tall.

### Cards, borders, radius

- **Cards = white + 1 px `--line` border + 8 px radius.** No shadow at
  rest. Hover/active uses `--shadow-sm`, not a colour change.
- **Inputs = 6 px radius.** Buttons match input radius (6 px) so they
  line up in the toolbar.
- **Pills = 9999 px radius.** Used only for status badges and the
  "이번 달 N편 남음" quota chip.
- **Section dividers** are 1 px `--line` rules, never dashed.

### Background imagery

- The product chrome has **no background imagery, no patterns, no
  textures, no illustrations**. It is intentionally quiet.
- The **video preview pane** has a dark surface (`#111827`) and a
  rounded `aspect-ratio: 9/16` container — that's the only place imagery
  lives. The mp4 itself or a `final.mp4` placeholder fills it.
- The **landing page** is the only surface that may use a single hero
  illustration (currently absent — flagged in Caveats).

### Animation

- **Gentle, short.** All transitions are 120–240 ms. The default easing
  is `cubic-bezier(0.16, 1, 0.30, 1)` ("gentle landing" — overshoots
  almost nothing).
- **Fades and slides only.** No bounces, no springs in product chrome.
- Step-by-step waiting copy fades in/out over 240 ms when the job state
  changes — it is the only "animation" the user sees during a render.
- Spinner usage is minimised; we prefer the named step over a bare
  indeterminate spinner (PRD §1.5-2).

### Hover, focus, press

- **Hover** on a primary button → background darkens from `--accent`
  to `--accent-hover` (Wanted blue-40). No scale, no shadow change.
- **Hover** on a secondary / ghost button → background tints to
  `--surface-soft` (grey-100).
- **Focus** ring = 3 px `--accent-ring` (Wanted blue at 16% alpha) outside the
  border. Always visible — accessibility-first.
- **Press / active** = no transform. We darken the background by one
  more step instead of scaling.
- **Disabled** = `opacity: 0.58`, cursor `not-allowed`.

### Borders, transparency, blur

- 1 px borders, hairline. We never use 2 px borders.
- Transparency / blur is **not used** in the product chrome. The only
  alpha values in the system are inside the video-preview templates
  (`rgba(0,0,0,0.55)` caption plate, etc.).

### Shadow system

- 4-stop scale: `--shadow-xs` / `sm` / `md` / `lg`. All cool, low-alpha,
  no coloured glow.
- **At rest, cards have no shadow** — only a border. Shadow is reserved
  for floating UI (dropdowns, popovers, the toast).

### Layout rules (fixed elements)

- **Header** is 58 px, sticky, with the brand mark + name on the left
  and the live API status dot + quota chip on the right.
- **No persistent sidebar** in the MVP — navigation is flat
  (`/app/create`, `/app/jobs/[id]`, `/app/dashboard`, `/app/presets`,
  `/app/settings`). A sidebar may arrive with the per-cut editor.
- **Sticky CTAs** at the bottom of long forms on mobile only.

### Imagery vibe (when we do use it)

- For template preview thumbnails: high-contrast, slightly desaturated
  stock-style stills with the template's caption / banner burnt in. The
  thumbnails are 1080×1920 cropped to a 540×960 card.

---

## ICONOGRAPHY

- **Library: [lucide-react](https://lucide.dev)** — shadcn/ui's default
  pairing and what `FRONTEND.md §7` implies. CDN-linked, ~24 px nominal,
  1.75 px stroke. We never increase stroke weight; weight differences
  read as inconsistency in a Korean UI.
- **Sizes**: 16 / 20 / 24 px. 16 px inside dense inputs and tabs, 20 px
  in buttons, 24 px in empty states.
- **Colour**: always `currentColor` — icons inherit text colour. Coloured
  icons only appear inside status badges where the badge already carries
  the colour.
- **No icon font.** No glyph hacks. No emoji as icons.
- **Logo**: a single `dullizze-mark.svg` (the Wanted blue→violet gradient square)
  and `dullizze-wordmark.svg` (mark + Dullizze in Wanted Sans Bold).
  Located in `assets/`.
- **Per-template marks**: 3 tiny SVG glyphs in `assets/templates/` — one
  each for `documentary`, `pop`, `banner` — used in the 형-picker. They
  are derived directly from the on-screen treatment of each template
  (cinematic stripe, yellow bubble, top/bottom bands).
- **Unicode used sparingly**: `·` (middle dot) for inline lists,
  `↓` in copy lifted from the dashboard prototype (`↓본 영상…↓`), `→`
  for in-copy flow arrows. No other unicode chars.
- **Substitution flag**: lucide is loaded from CDN at design time. For
  production, install `lucide-react` and tree-shake to the ~30 icons we
  actually use.

---

## CAVEATS — what's NOT done / what we need

The `## Caveats` block at the bottom of every Dullizze design folder is
where the human and the agent stay honest. Read it first.

1. **Font files**. The user uploaded `wanted-sans-main.zip` and
   `Pretendard-1.3.9.zip` but they were not present in the project
   filesystem when this system was built. We are CDN-loading both
   families. To self-host, unzip into `/fonts/` and switch the two
   `@import` statements at the top of `colors_and_type.css` to
   `@font-face` declarations.
2. **Wanted DS Figma**. The named Wanted-DS file was not actually
   mounted (only `@shadcn_ui - Design System (Community).fig` was
   visible to the explorer). Colour tokens were instead extracted from
   the existing `web/dashboard.html` internal prototype, which is the
   on-product source-of-truth today.
3. **No real product illustrations exist yet.** The landing page hero,
   empty-state illustrations, and template-preview thumbnails are all
   placeholders. Flagged in the UI kit.
4. **No production photography.** The video templates use stock /
   AI-generated stills supplied at render time — none of those assets
   live in this design system.

---

## How to read this folder

1. Open the **Design System** tab — every card you see is a file in
   `preview/`. Scroll through Type / Colors / Spacing / Components /
   Brand for an overview.
2. Open `ui_kits/dullizze-app/index.html` to see the product surface
   stitched together — create flow, job review, dashboard, all wired up
   as a click-through.
3. When iterating, edit tokens in `colors_and_type.css`. Every preview
   card and UI-kit screen reads from those vars.
