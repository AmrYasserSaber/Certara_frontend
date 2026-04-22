import { defineStore } from 'pinia';
import notificationService from '@/services/notification.service';
import { NOTIFICATION_POLL_INTERVAL_MS } from '@/utils/constants';
import { useAuthStore } from '@/stores/auth.store';

/**
 * DEV 5 — Notification store with 30-second polling.
 * Usage: import { useNotificationStore } and call `startPolling()` after login.
 */
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    loading: false,
    error: '',
    _timer: null,
  }),

  getters: {
    unreadCount: (s) => s.notifications.filter((n) => !n.is_read).length,
  },

  actions: {
    async fetchAll() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return;
      this.loading = true;
      try {
        const { data } = await notificationService.list();
        this.notifications = Array.isArray(data) ? data : (data?.notifications ?? []);
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل التنبيهات';
      } finally {
        this.loading = false;
      }
    },

    async markRead(id) {
      const item = this.notifications.find((n) => n.id === id);
      if (item) item.is_read = true;
      try {
        await notificationService.markRead(id);
      } catch {
        if (item) item.is_read = false;
      }
    },

    async markAllRead() {
      const previous = this.notifications.map((n) => ({ ...n }));
      this.notifications.forEach((n) => (n.is_read = true));
      try {
        await notificationService.markAllRead();
      } catch {
        this.notifications = previous;
      }
    },

    startPolling(interval = NOTIFICATION_POLL_INTERVAL_MS) {
      this.stopPolling();
      this._timer = setInterval(() => this.fetchAll(), interval);
    },

    stopPolling() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    },

    reset() {
      this.stopPolling();
      this.notifications = [];
      this.error = '';
    },
  },
});
