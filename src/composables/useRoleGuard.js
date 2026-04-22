import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Small helper for components that need to branch by role.
 *   const { is, hasAny, role } = useRoleGuard();
 *   if (is(ROLES.ADMIN)) { ... }
 */
export function useRoleGuard() {
  const auth = useAuthStore();

  const role = computed(() => auth.user?.role);

  function is(r) {
    return role.value === r;
  }

  function hasAny(...roles) {
    return roles.some((r) => r === role.value);
  }

  return { role, is, hasAny };
}
