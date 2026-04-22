/** DEV 1 — Auth routes (login + register). */
export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true, requiresAuth: false, layout: 'blank' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guestOnly: true, requiresAuth: false, layout: 'blank' },
  },
];
