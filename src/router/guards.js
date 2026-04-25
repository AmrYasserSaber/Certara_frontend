import { useAuthStore } from '@/stores/auth.store';
import { ROLE_HOME_ROUTE } from '@/utils/constants';

/**
 * Global beforeEach guard. Respects:
 *   - meta.requiresAuth (default: true unless the route explicitly opts out)
 *   - meta.guestOnly   (login/register — block if already authenticated)
 *   - meta.roles       (array of allowed roles)
 */
export function createAuthGuard() {
  return async (to) => {
    const auth = useAuthStore();
    await auth.ensureSession();

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { path: ROLE_HOME_ROUTE[auth.user?.role] || '/' };
    }

    if (to.meta.requiresAuth !== false && !auth.isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }

    if (Array.isArray(to.meta.roles) && to.meta.roles.length) {
      const role = auth.user?.role;
      if (!role || !to.meta.roles.includes(role)) {
        return { path: '/forbidden' };
      }
    }

    return true;
  };
}
