import { ROLES } from '@/utils/constants';

/** DEV 3 — Sample size officer routes. */
export default [
  {
    path: '/sample-size',
    name: 'sample.dashboard',
    component: () => import('@/views/sample-size/SampleSizeDashboard.vue'),
    meta: { roles: [ROLES.SAMPLE_SIZE_OFFICER] },
  },
  {
    path: '/sample-size/research/:id',
    name: 'sample.form',
    component: () => import('@/views/sample-size/SampleSizeForm.vue'),
    meta: { roles: [ROLES.SAMPLE_SIZE_OFFICER] },
    props: true,
  },
];
