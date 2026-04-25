import { ROLES } from '@/utils/constants';

/** DEV 4 — Admin routes. */
export default [
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
  {
    path: '/admin/users/pending',
    name: 'admin.users.pending',
    component: () => import('@/views/admin/PendingUsersView.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
  {
    path: '/admin/research',
    name: 'admin.research.list',
    component: () => import('@/views/admin/AllResearchView.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
  {
    path: '/admin/research/:id',
    name: 'admin.research.detail',
    component: () => import('@/views/admin/ResearchDetailAdmin.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
    props: true,
  },
  {
    path: '/admin/logs',
    name: 'admin.logs',
    component: () => import('@/views/admin/ActivityLogsView.vue'),
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] },
  },
];
