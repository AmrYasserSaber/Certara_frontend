/** DEV 5 — Notifications (available to any authenticated role). */
export default [
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
  },
];
