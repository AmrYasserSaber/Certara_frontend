<template>
  <div class="flex bg-surface min-h-screen text-on-surface overflow-x-hidden">
    <AppSidebar
      :items="navItems"
      :footer-items="footerItems"
      :primary-action="primaryAction"
      :active-variant="activeVariant"
      :open="sidebarOpen"
    />

    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-inverse-surface/40 md:hidden"
      @click="sidebarOpen = false"
    />

    <div class="flex-1 flex flex-col min-h-screen md:mr-72">
      <AppTopBar
        :title="pageTitle"
        :user="topbarUser"
        :dark="darkTopbar"
        :show-language="showLanguage"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @logout="onLogout"
      />
      <main class="flex-1 p-4 md:p-8 lg:p-10 space-y-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from './AppSidebar.vue';
import AppTopBar from './AppTopBar.vue';
import { useAuthStore } from '@/stores/auth.store';
import { ROLES, ROLE_LABELS_AR } from '@/utils/constants';

const props = defineProps({
  pageTitle: { type: String, default: '' },
  primaryAction: { type: Object, default: null },
  activeVariant: {
    type: String,
    default: 'gold',
    validator: (v) => ['gold', 'teal', 'light'].includes(v),
  },
  darkTopbar: { type: Boolean, default: true },
  /** Optional custom nav; when not provided we build one from the user's role. */
  navItems: { type: Array, default: null },
  footerItems: { type: Array, default: null },
});

const sidebarOpen = ref(false);
const auth = useAuthStore();
const router = useRouter();

const topbarUser = computed(() =>
  auth.user
    ? {
        name: auth.user.name,
        avatar: auth.user.avatar_url,
        subtitle: ROLE_LABELS_AR[auth.user.role] || '',
      }
    : null,
);
const showLanguage = computed(() => {
  const role = auth.user?.role;
  return role !== ROLES.ADMIN && role !== ROLES.MANAGER;
});

const navItems = computed(() => props.navItems ?? buildDefaultNav(auth.user?.role));
const footerItems = computed(
  () =>
    props.footerItems ?? [
      { to: '/profile', label: 'الملف الشخصي', icon: 'person' },
      { to: '/notifications', label: 'التنبيهات', icon: 'notifications' },
    ],
);

async function onLogout() {
  await auth.logout();
  router.replace('/login');
}

function buildDefaultNav(role) {
  switch (role) {
    case ROLES.STUDENT:
      return [
        { to: '/student', label: 'لوحة القيادة', icon: 'dashboard' },
        { to: '/student/research/new', label: 'تقديم بروتوكول جديد', icon: 'add_circle' },
      ];
    case ROLES.SAMPLE_SIZE_OFFICER:
      return [{ to: '/sample-size', label: 'الأبحاث المعلقة', icon: 'dashboard' }];
    case ROLES.REVIEWER:
      return [{ to: '/reviewer', label: 'الأبحاث المسندة', icon: 'rate_review' }];
    case ROLES.ADMIN:
      return [
        { to: '/admin', label: 'لوحة القيادة', icon: 'dashboard' },
        { to: '/admin/users/pending', label: 'تفعيل المستخدمين', icon: 'how_to_reg' },
        { to: '/admin/research', label: 'الأبحاث', icon: 'description' },
        { to: '/admin/logs', label: 'سجل النشاط', icon: 'history' },
      ];
    case ROLES.MANAGER:
      return [{ to: '/manager', label: 'لوحة القيادة', icon: 'dashboard' }];
    default:
      return [];
  }
}
</script>
