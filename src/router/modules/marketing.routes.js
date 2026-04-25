/** Marketing / public routes (guest-only). */
export default [
  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { guestOnly: true, requiresAuth: false, layout: 'blank' },
  },
];
