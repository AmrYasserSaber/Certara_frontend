import { ROLES } from '@/utils/constants';

/** DEV 3 — Reviewer (blind review) routes. */
export default [
  {
    path: '/reviewer',
    name: 'reviewer.dashboard',
    component: () => import('@/views/reviewer/ReviewerDashboard.vue'),
    meta: { roles: [ROLES.REVIEWER] },
  },
  {
    path: '/reviewer/research/:id',
    name: 'reviewer.research',
    component: () => import('@/views/reviewer/ReviewResearchView.vue'),
    meta: { roles: [ROLES.REVIEWER] },
    props: true,
  },
];
