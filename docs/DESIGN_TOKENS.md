# Design tokens

All raw hex values live in `tailwind.config.js`. Components MUST reference the
token name (e.g. `bg-primary`), never the literal color.

## Color palette (Material theme from stitch)

| Token                        | Hex        | Usage                                         |
| ---------------------------- | ---------- | --------------------------------------------- |
| `primary`                    | `#005454`  | Brand primary, gradient top, focus rings      |
| `primary-container`          | `#0d6e6e`  | Gradient bottom, active nav fill              |
| `on-primary`                 | `#ffffff`  | Text on primary backgrounds                   |
| `on-primary-container`       | `#9dedec`  | Text on primary-container backgrounds         |
| `primary-fixed`              | `#a0f0f0`  | Success badge fill                            |
| `primary-fixed-dim`          | `#84d4d3`  | Focus ring offsets                            |
| `on-primary-fixed`           | `#002020`  | Text on success/fixed backgrounds             |
| `secondary`                  | `#805600`  | Warning text                                  |
| `secondary-container`        | `#fdba49`  | Warning fill, secondary CTA                   |
| `on-secondary-container`     | `#704b00`  | Text on warning/secondary fills               |
| `tertiary`                   | `#3d4c5d`  | Info/accent text                              |
| `tertiary-container`         | `#556476`  | Info card bg                                  |
| `tertiary-fixed`             | `#d4e4f9`  | Info badge bg                                 |
| `on-tertiary-fixed`          | `#0d1d2c`  | Text on info backgrounds                      |
| `error`                      | `#ba1a1a`  | Destructive CTA, danger badge                 |
| `error-container`            | `#ffdad6`  | Error badge bg                                |
| `on-error-container`         | `#93000a`  | Text on error backgrounds                     |
| `surface`                    | `#f6fafe`  | Page background                               |
| `surface-container-lowest`   | `#ffffff`  | Card bg                                       |
| `surface-container-low`      | `#f0f4f8`  | Subtle card bg                                |
| `surface-container`          | `#eaeef2`  | Elevated bg                                   |
| `surface-container-high`     | `#e4e9ed`  | Table row hover, divider                      |
| `surface-container-highest`  | `#dfe3e7`  | Input filled bg                               |
| `on-background` / `on-surface` | `#171c1f` | Primary text                                  |
| `on-surface-variant`         | `#3e4948`  | Secondary / muted text                        |
| `outline`                    | `#6e7979`  | Icon strokes, placeholder                     |
| `outline-variant`            | `#bec9c8`  | Dividers, borders                             |
| `inverse-surface`            | `#2c3134`  | Dark modal overlay                            |
| `inverse-on-surface`         | `#edf1f5`  | Text on inverse surface                       |

### Custom tokens (not from Material)

| Token                | Hex        | Usage                                   |
| -------------------- | ---------- | --------------------------------------- |
| `nav-dark`           | `#0F1F2E`  | Sidebar bg, dark topbar                 |
| `nav-dark-elevated`  | `#172C3F`  | Sidebar active-item bg (gold rail)      |
| `nav-dark-hover`     | `#1A2E40`  | Sidebar nav hover state                 |
| `nav-dark-search`    | `#1A2E3F`  | Dark search field bg                    |
| `gold-accent`        | `#E8A838`  | Active nav rail, sidebar CTA            |
| `gold-accent-hover`  | `#D4982E`  | Gold CTA hover                          |

## Typography

| Family   | Tailwind token    | Used for                                  |
| -------- | ----------------- | ----------------------------------------- |
| Tajawal  | `font-headline`   | Titles, stat values, CTA labels           |
| IBM Plex Sans Arabic | `font-body` (default) | Body copy, form fields            |
| JetBrains Mono | `font-mono` | IDs, serial numbers, timestamps, counts  |

Numbers inside `.font-mono` or `.tabular-nums` render LTR with tabular figures
even inside an RTL page.

## Border radius (stitch override)

| Tailwind class | Value       |
| -------------- | ----------- |
| `rounded`      | `0.125rem`  |
| `rounded-lg`   | `0.25rem`   |
| `rounded-xl`   | `0.5rem`    |
| `rounded-2xl`  | `0.75rem`   |
| `rounded-full` | `9999px`    |

## Elevation / shadow

| Class              | Purpose                             |
| ------------------ | ----------------------------------- |
| `shadow-ambient-sm`| Default card                        |
| `shadow-ambient`   | Elevated card                       |
| `shadow-ambient-lg`| Modals                              |
| `shadow-primary-cta` | Primary button resting state       |
| `shadow-gold-cta`  | Gold CTA resting state              |

## @apply utility classes (from `src/assets/css/main.css`)

### Surfaces
`.card`, `.card-elevated`, `.card-flat`, `.card-inverse`, `.ghost-border`,
`.ambient-shadow`, `.glass-dark`, `.glass-light`

### Gradients
`.bg-primary-gradient`, `.bg-nav-dark`, `.bg-gold-gradient`

### Buttons
`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-outline`,
`.btn-danger`, `.btn-icon`, `.btn-icon-dark`, `.btn-sm`, `.btn-lg`

### Inputs
`.input`, `.input-error`, `.input-underline`, `.form-label`, `.form-error`,
`.form-help`, `.search-field-dark`, `.search-field-light`

### Navigation (sidebar items)
`.nav-item`, `.nav-item-active-gold`, `.nav-item-active-teal`,
`.nav-item-active-light`

### Badges
`.badge`, `.badge-neutral`, `.badge-info`, `.badge-success`, `.badge-warning`,
`.badge-error`, `.badge-pending`

### Tables
`.table-shell`, `.table-base`, `.table-head`, `.table-row`

### Utilities
`.no-scrollbar`, `.scrollbar-thin`, `.text-balance`, `.bg-dot-grid`,
`.decorative-blob`

## Status → badge variant map

| `RESEARCH_STATUS` value       | Badge variant |
| ----------------------------- | ------------- |
| `draft`                       | neutral       |
| `pending_activation`          | pending       |
| `awaiting_payment_1`          | warning       |
| `awaiting_sample_size`        | info          |
| `awaiting_payment_2`          | warning       |
| `in_review`                   | info          |
| `revision_requested`          | warning       |
| `reviewer_approved`           | success       |
| `manager_reviewing`           | info          |
| `approved`                    | success       |
| `rejected`                    | error         |

`StatusBadge` reads this map automatically from `utils/constants.js`.
