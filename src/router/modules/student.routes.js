import { ROLES } from '@/utils/constants';

/** DEV 2 — Student & Payment routes. */
export default [
  {
    path: '/student',
    name: 'student.dashboard',
    component: () => import('@/views/student/DashboardView.vue'),
    meta: { roles: [ROLES.STUDENT] },
  },
  {
    path: '/student/research/new',
    name: 'student.research.new',
    component: () => import('@/views/student/NewResearchView.vue'),
    meta: { roles: [ROLES.STUDENT] },
  },
  {
    path: '/student/research/:id',
    name: 'student.research.detail',
    component: () => import('@/views/student/ResearchDetailView.vue'),
    meta: { roles: [ROLES.STUDENT] },
    props: true,
  },
  {
    path: '/student/research/:id/edit',
    name: 'student.research.edit',
    component: () => import('@/views/student/EditResearchView.vue'),
    meta: { roles: [ROLES.STUDENT] },
    props: true,
  },
  {
    path: '/student/research/:id/pay',
    name: 'student.research.pay',
    component: () => import('@/views/student/PaymentView.vue'),
    meta: { roles: [ROLES.STUDENT] },
    props: true,
  },
  {
    path: '/student/research/:id/receipt',
    name: 'student.research.receipt',
    component: () => import('@/views/student/ReceiptView.vue'),
    meta: { roles: [ROLES.STUDENT] },
    props: true,
  },
  {
    path: '/student/research/approved',
    name: 'student.research.approved',
    component: () => import('@/views/student/ApprovedResearchView.vue'),
    meta: { roles: [ROLES.STUDENT] },
  },
];
