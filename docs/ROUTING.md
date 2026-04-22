# Routing

Vue Router 4 with a single global guard. Every route lives in a per-domain
module file so no two developers touch the same file.

## Files

```
src/router/
  index.js                  aggregator (DEV 1 only)
  guards.js                 createAuthGuard()
  modules/
    auth.routes.js          DEV 1
    student.routes.js       DEV 2
    reviewer.routes.js      DEV 3
    sample-size.routes.js   DEV 3
    admin.routes.js         DEV 4
    manager.routes.js       DEV 4
    notification.routes.js  DEV 5
```

## Route meta schema

Each route may declare:

| key            | default | purpose                                                     |
| -------------- | ------- | ----------------------------------------------------------- |
| `requiresAuth` | `true`  | Set to `false` to opt out (login, register, 404, 403).      |
| `guestOnly`    | `false` | Redirects authenticated users away (used for login/register).|
| `roles`        | `[]`    | Array of `ROLES.*` values allowed on this route.            |
| `layout`       | `''`    | `'blank'` disables the app shell (login/register/404).      |

Unknown roles land on `/forbidden`. Unauthenticated users get redirected to
`/login?redirect=<original>`.

## Adding a new route

1. Pick the correct module file (or create a new one if you own a new domain).
2. Add a route with an explicit `name`, lazy-loaded `component`, and
   `meta.roles` set to the roles allowed to visit.
3. If it's a new module file, import it in `src/router/index.js` and spread it
   into the routes array. This is the ONLY reason to touch `router/index.js`.

```js
// router/modules/student.routes.js
import { ROLES } from '@/utils/constants';

export default [
  {
    path: '/student/research/:id/audit',
    name: 'student.research.audit',
    component: () => import('@/views/student/AuditLogView.vue'),
    meta: { roles: [ROLES.STUDENT] },
    props: true,
  },
];
```

## Post-login redirects

`utils/constants.js#ROLE_HOME_ROUTE` maps each role to its default landing
route. The `/login` page reads this table (and honors `?redirect=<path>` if it
was set by the guard). If you add a new role, update that map.

## Guest-only routes

Login and register use `meta: { guestOnly: true }` so an already-authenticated
user visiting `/login` is bounced to their role home.

## Navigation helpers

- `useRoleGuard()` (in `composables/useRoleGuard.js`) returns
  `{ role, is(r), hasAny(...rs) }` for in-component role branching.
- `utils/constants.js#ROLES` is the source of truth for role strings.
- `utils/constants.js#ROLE_LABELS_AR` has the Arabic display names.
