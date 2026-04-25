export default [
  {
    path: '/reviewer',
    redirect: '/reviewer/assigned',
  },
  {
    path: '/reviewer/assigned',
    component: () => import('@/views/reviewer/ReviewResearchView.vue'),
    meta: { requiresAuth: true, role: 'reviewer', roles: ['reviewer'] },
  },
];
