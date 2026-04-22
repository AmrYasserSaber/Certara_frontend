<template>
  <div
    v-click-outside="close"
    class="relative"
  >
    <button
      type="button"
      :class="dark ? 'btn-icon-dark' : 'btn-icon'"
      aria-label="notifications"
      @click="open = !open"
    >
      <AppIcon
        name="notifications"
        :filled="open"
      />
      <span
        v-if="store.unreadCount"
        class="absolute top-1 left-1 bg-error text-on-error text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center"
      >
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
      </span>
    </button>

    <transition name="fade">
      <div
        v-if="open"
        class="absolute top-full mt-2 left-0 w-80 bg-surface-container-lowest rounded-xl shadow-ambient-lg ghost-border overflow-hidden z-50 animate-slide-up"
      >
        <header class="flex items-center justify-between px-4 py-3 border-b border-surface-variant">
          <h4 class="font-headline font-bold text-on-background">
            التنبيهات
          </h4>
          <button
            v-if="store.notifications.length"
            type="button"
            class="text-xs text-primary font-bold hover:text-primary-container transition-colors"
            @click="markAll"
          >
            تحديد الكل كمقروء
          </button>
        </header>

        <div class="max-h-80 overflow-y-auto scrollbar-thin p-2 space-y-2">
          <EmptyState
            v-if="!store.notifications.length && !store.loading"
            icon="notifications_off"
            title="لا توجد تنبيهات"
            description="ستظهر تنبيهاتك هنا عند وصولها."
          />
          <LoadingSpinner
            v-else-if="store.loading"
            class="py-6 justify-center w-full"
          />
          <NotificationItem
            v-for="n in store.notifications.slice(0, 5)"
            :key="n.id"
            :notification="n"
            @click="onItemClick"
          />
        </div>

        <footer class="border-t border-surface-variant p-3 text-center">
          <router-link
            to="/notifications"
            class="text-sm text-primary font-bold hover:text-primary-container transition-colors"
            @click="close"
          >
            عرض كل التنبيهات
          </router-link>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppIcon from './AppIcon.vue';
import NotificationItem from './NotificationItem.vue';
import EmptyState from './EmptyState.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { useNotificationStore } from '@/stores/notification.store';

defineProps({
  dark: { type: Boolean, default: false },
});

const open = ref(false);
const store = useNotificationStore();
const router = useRouter();

function close() {
  open.value = false;
}

async function markAll() {
  await store.markAllRead();
}

function onItemClick(n) {
  if (!n.is_read) store.markRead(n.id);
  close();
  if (n.research_id) {
    router.push('/notifications');
  }
}

onMounted(() => {
  store.fetchAll();
  store.startPolling();
});

// Lightweight outside-click directive inline
const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value?.();
    };
    document.addEventListener('click', el.__clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el.__clickOutside);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
