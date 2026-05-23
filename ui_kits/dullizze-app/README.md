# Dullizze UI Kit — Web App

The product surface. This is a high-fidelity, click-through recreation of
the Dullizze app shell — the part the subscribed user spends 99% of their
time in. Open `index.html` to see it stitched together.

## Files

- `index.html` — entry; loads React + Babel from CDN, all `.jsx` modules,
  and the design-system CSS. Owns the routing state (`/app/create`,
  `/app/jobs/:id`, `/app/dashboard`, `/app/presets`).
- `api-client.js` — real FastAPI adapter. Defaults to
  `http://localhost:8000`; use `?apiBase=http://host:port` to point at
  another API, or `?api=mock` to keep the in-memory mock.
- `primitives.jsx` — `Button`, `Input`, `Textarea`, `Select`,
  `Segmented`, `Field`, `Badge`, `Card`, `Quota`, `Icon`.
- `Shell.jsx` — top bar (brand + nav + API status + quota chip +
  avatar) and the main two-column layout.
- `Create.jsx` — the `/app/create` flow: topic → 형 → branding → 생성.
  Submits to fake-API, transitions into the Job screen.
- `Job.jsx` — `/app/jobs/[id]`: status badge + step polling + video
  preview pane + meta + retry / publish.
- `Dashboard.jsx` — `/app/dashboard`: quota card + job list with
  thumbnails, filters, retry.
- `fake-api.js` — pure in-memory mock used only when `?api=mock` is set:
  `createJob`, `getJob`, `tickJob` (simulates the 5-step pipeline over
  ~10s), `listJobs`, `getQuota`.

## What's intentionally simplified

- No real video. The preview pane shows a styled `final.mp4` placeholder
  + the chosen template's swatch.
- Job creation and polling call the FastAPI job endpoints when the API is
  running. The mock mode still uses a local dict for design review.
- Auth, onboarding, payment, YouTube OAuth — out of scope for the MVP
  surface. Stubs visible in `Settings`.
- Per-cut video editor (PRD §6 / FRONTEND §6) is Phase 2 — left as a
  "준비 중" tab in the nav.

## How it maps to PRD/FRONTEND

| FRONTEND.md route | File |
|---|---|
| `/app/create` (§3.1) | `Create.jsx` |
| `/app/jobs/[id]` (§3.2) | `Job.jsx` |
| `/app/dashboard` (§3.3) | `Dashboard.jsx` |
| `/app/presets` (§3.4) | stubbed inside `Dashboard.jsx` |
| `/app/jobs/[id]/edit` (§6) | not implemented — nav shows "준비 중" |
