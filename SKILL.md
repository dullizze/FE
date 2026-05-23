---
name: dullizze-design
description: Use this skill to generate well-branded interfaces and assets for Dullizze (둘리즈), a Korean subscription web SaaS that auto-generates 9:16 YouTube Shorts. Use for production code OR for throwaway prototypes / mocks / decks. Contains the brand's colour and type tokens, Pretendard / Wanted Sans fonts (CDN-linked), logo + template-thumbnail SVGs, content-and-voice rules, and a full UI-kit recreation of the product app surface in React.
user-invocable: true
---

# Dullizze design skill

Read `README.md` first — it contains brand context (Dullizze is a Korean
SaaS that turns one-line topics into 9:16 YouTube Shorts), the content
voice rules (`해요체` Korean, plain language, no emoji), and the visual
foundations (Wanted Blue `#0066FF` on cool grey, shadcn-style chrome, NO
gradients in product chrome).

Then explore the other files:

- `colors_and_type.css` — every CSS variable. Import it and you have the
  brand. The only thing it does NOT contain is local font files —
  Pretendard and Wanted Sans are CDN-loaded from `jsdelivr`.
- `preview/*.html` — small reference cards (type, colour, components).
  Open any of them to see a real working example of a primitive.
- `ui_kits/dullizze-app/` — high-fidelity React recreation of the
  product surface. `index.html` is the click-through entry; the modular
  `.jsx` files (`Shell`, `Create`, `Job`, `Dashboard`, `primitives`,
  `Icon`) are reusable building blocks.
- `assets/` — `dullizze-mark.svg`, `dullizze-wordmark.svg`, and
  `templates/{documentary,pop,banner}.svg` template thumbnails. Use
  these verbatim — do not redraw the mark.
- `source-refs/` — the verbatim PRD / FRONTEND / AGENTS docs from the
  Dullizze repo, plus the existing `dashboard.html` prototype. Use
  these to look up product behaviour, API contracts, or Korean copy
  samples before inventing your own.

## When invoked

If creating **visual artifacts** (slides, mocks, throwaway prototypes,
landing pages, decks): import `colors_and_type.css`, copy SVG assets
out of `assets/`, and lift component patterns from the UI kit or the
preview cards. Write static HTML files for the user to view.

If working on **production code**: the Next.js + shadcn/ui app should
mirror the tokens verbatim (paste the contents of `colors_and_type.css`
into `globals.css` or split into the Tailwind theme). The UI kit's
components are simple-cosmetic versions — re-implement them on top of
real shadcn/Radix primitives for production, but keep the look pixel-
identical.

If the user invokes this skill with no other guidance:
- ask what they want to build (landing page, a new screen of the app,
  a slide deck pitching Dullizze, a marketing email, etc.),
- ask 4-6 focused questions (target audience, length, tone variations,
  Korean vs. bilingual, where it'll be used),
- then act as an expert designer who outputs an HTML artifact OR
  production-ready code, depending on the brief.

## Hard rules (do not break)

1. **Korean first.** All user-facing copy is in Korean (해요체). English
   appears only in code, debug labels, and the `description:` line of
   this front-matter.
2. **No emoji** in product UI. No bluish-purple gradients. No coloured
   left-border accent cards. No decorative SVG drawn from scratch — copy
   from `assets/` or use lucide icons inline (see `Icon.jsx`).
3. **Wanted Blue `#0066FF` is the only primary-action colour.** Never use
   template accents for primary buttons. Never use the primary blue for body text.
4. **Pretendard for body, Wanted Sans for display.** Korean text uses
   `word-break: keep-all; line-break: strict;`.
5. **Cards = white + 1px `--line` border + 8px radius, no shadow at
   rest.** This is not negotiable — it's how every Dullizze screen
   composes.
6. **Long-running waits get NAMED steps**, not bare spinners
   (`대본 쓰는 중… → 목소리 입히는 중… → 영상 만드는 중…`). See PRD §1.5-2.

## Caveats this skill inherits

- Pretendard + Wanted Sans are loaded from public CDNs (jsdelivr). For
  offline / production-grade work, drop the source ZIPs into `fonts/`
  and switch the two `@import` statements in `colors_and_type.css` to
  `@font-face` declarations.
- The Wanted DS Figma file referenced in the original brief was not
  accessible at build time. Colour tokens were extracted from the
  Dullizze internal prototype (`source-refs/dashboard.html`).
- Lucide icons are inlined as SVG paths in `ui_kits/dullizze-app/Icon.jsx`.
  For broader icon coverage, add lucide-react (or copy more paths from
  `lucide.dev/icons`).
