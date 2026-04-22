# IRB Digital System — Frontend

Arabic-first (RTL) Vue 3 SPA for the IRB approval workflow.
Companion to the Vanilla PHP + MySQL backend; this repository contains the
frontend scaffold that the 5-dev team described in `TEAM_DISTRIBUTION.md` will
plug their feature work into.

## Stack

| Layer           | Choice                                       |
| --------------- | -------------------------------------------- |
| Framework       | Vue 3 + `<script setup>` (JavaScript)        |
| Build tool      | Vite                                         |
| Styling         | Tailwind CSS 3 + `@tailwindcss/forms`        |
| State           | Pinia                                        |
| HTTP            | Axios (JWT interceptor, 401 auto-logout)     |
| Routing         | Vue Router (role-based guards)               |
| Validation      | Vee-Validate + Yup                           |
| Dates           | Day.js (Arabic locale + `relativeTime`)      |
| Iconography     | Google Material Symbols Outlined (variable)  |
| Typography      | Tajawal, IBM Plex Sans Arabic, JetBrains Mono |

## Prerequisites

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

Available scripts:

- `npm run dev` – start the Vite dev server.
- `npm run build` – production build.
- `npm run preview` – preview the production build.
- `npm run lint` – ESLint (auto-fix).
- `npm run format` – Prettier.

## Repository layout

```
src/
  assets/css/main.css        Tailwind entry + @apply utility layer
  components/
    shared/                  DEV 1 — reusable component library (owner-locked)
    auth/                    Small auth-specific helpers
    student/ payment/ …      One sub-folder per team domain
  composables/               useToast, useConfirm, useRoleGuard
  layouts/                   AppShellLayout, BlankLayout
  router/
    index.js                 Root router + global guard
    guards.js                requireAuth / requireRole helpers
    modules/*.routes.js      One routes file per domain (no cross-file edits)
  services/                  Axios wrappers per API domain
  stores/                    Pinia stores per domain
  utils/
    http.js                  Shared axios instance (JWT, 401, 5xx toasts)
    constants.js             Roles, statuses, Arabic labels, storage keys
    helpers.js               formatDate / formatCurrency / formatFileSize / …
  views/                     Route-rendered pages, grouped by role
  App.vue                    RouterView + global Toast + Confirm host
  main.js                    Bootstraps pinia, router, global components
docs/
  COMPONENTS.md              Shared component cheat-sheet
  DESIGN_TOKENS.md           Colors, typography, @apply utilities
  ROUTING.md                 How to add a new route module
```

## Developer handbook

- Every **protected** route MUST declare `meta.roles` and lives in its own
  `router/modules/*.routes.js` file (see `docs/ROUTING.md`). Only DEV 1 edits
  `src/router/index.js`.
- Every service goes through `@/utils/http` — never create a bare `axios`
  instance, otherwise you bypass JWT + 401 handling.
- UI primitives live in `@/components/shared`. When you need a new one, coordinate
  with DEV 1 and add it there (rather than duplicating in role folders).
- Raw hex colors only ever appear in `tailwind.config.js`. Components use design
  tokens (`bg-primary`, `text-on-surface`, `ring-gold-accent`, …).
- Blind review: reviewer views NEVER render student identifying fields. If the
  API leaks them, `utils/helpers.js#sanitizeResearchForReviewer` strips them
  defensively.

## Team map

See `TEAM_DISTRIBUTION.md` (project root) for the complete 5-dev layout. The
scaffold encodes the ownership matrix: each dev has a dedicated folder tree under
`components/*`, `views/*`, `stores/*`, and `services/*`, plus a single
`router/modules/<domain>.routes.js` they own end to end.

## Build verification

The scaffold passes `npm run build` out of the box with every role route
registered, every placeholder view wired, and every Pinia store + axios service
stubbed against the full `TEAM_DISTRIBUTION.md` API contract.
