import { ROLES } from '@/utils/constants';

/** DEV 4 — Manager routes. */
export default [
  {
    path: '/manager',
    name: 'manager.dashboard',
    component: () => import('@/views/manager/ManagerDashboard.vue'),
    meta: { requiresAuth: true, roles: [ROLES.MANAGER] },
  },
  {
    path: '/manager/research/:id',
    name: 'manager.research',
    component: () => import('@/views/manager/ManagerResearchView.vue'),
    meta: { requiresAuth: true, roles: [ROLES.MANAGER] },
    props: true,
  },
  {
    path: '/manager/research/:id/certificate',
    name: 'manager.certificate',
    component: () => import('@/views/manager/CertificatePreview.vue'),
    meta: { requiresAuth: true, roles: [ROLES.MANAGER] },
    props: true,
  },
];
