import { createRouter, createWebHistory } from 'vue-router';
import { createAuthGuard } from '@/router/guards';
import { useAuthStore } from '@/stores/auth.store';
import { ROLE_HOME_ROUTE } from '@/utils/constants';

import authRoutes from '@/router/modules/auth.routes';
import marketingRoutes from '@/router/modules/marketing.routes';
import studentRoutes from '@/router/modules/student.routes';
import reviewerRoutes from '@/router/modules/reviewer.routes';
import sampleSizeRoutes from '@/router/modules/sample-size.routes';
import adminRoutes from '@/router/modules/admin.routes';
import managerRoutes from '@/router/modules/manager.routes';
import notificationRoutes from '@/router/modules/notification.routes';

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: () => {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return '/landing';
      return ROLE_HOME_ROUTE[auth.user?.role] || '/login';
    },
  },
  ...marketingRoutes,
  ...authRoutes,
  ...studentRoutes,
  ...reviewerRoutes,
  ...sampleSizeRoutes,
  ...adminRoutes,
  ...managerRoutes,
  ...notificationRoutes,
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
    meta: { requiresAuth: false, layout: 'blank' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { requiresAuth: false, layout: 'blank' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    return { top: 0 };
  },
});

router.beforeEach(createAuthGuard());

export default router;
