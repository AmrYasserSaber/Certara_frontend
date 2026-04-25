export default [
  {
    path: '/sample-size',
    component: () => import('@/views/sample-size/SampleSizeDashboard.vue'),
    meta: { requiresAuth: true, role: 'sample_size_officer', roles: ['sample_size_officer'] },
  },
];
