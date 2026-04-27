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
    _normalizeNotification(raw) {
      if (!raw || typeof raw !== 'object') return null;

      const id = raw.id ?? raw.notification_id ?? raw.uuid ?? raw._id;
      if (id == null) return null;

      const isRead =
        raw.is_read ??
        raw.isRead ??
        raw.read ??
        // If backend sends read_at timestamp, consider it read.
        Boolean(raw.read_at ?? raw.readAt);

      return {
        ...raw,
        id,
        title: raw.title ?? raw.subject ?? raw.name ?? 'تنبيه جديد',
        message: raw.message ?? raw.body ?? raw.content ?? '',
        type: raw.type ?? raw.notification_type ?? 'general',
        is_read: Boolean(isRead),
        created_at: raw.created_at ?? raw.createdAt ?? raw.timestamp ?? new Date().toISOString(),
        research_id: raw.research_id ?? raw.researchId ?? raw.entity_id ?? raw.entityId ?? null,
      };
    },

    _extractListFromPayload(payload) {
      if (!payload || typeof payload !== 'object') return null;

      if (Array.isArray(payload.notifications)) return payload.notifications;
      if (Array.isArray(payload.items)) return payload.items;
      if (Array.isArray(payload.results)) return payload.results;

      const nested = payload.data;
      if (Array.isArray(nested)) return nested;
      if (nested && typeof nested === 'object') {
        if (Array.isArray(nested.notifications)) return nested.notifications;
        if (Array.isArray(nested.items)) return nested.items;
        if (Array.isArray(nested.results)) return nested.results;
      }

      return null;
    },

    _normalizeListResponse(payload) {
      if (Array.isArray(payload)) return payload;
      const list = this._extractListFromPayload(payload) || [];
      return list.map((n) => this._normalizeNotification(n)).filter(Boolean);
    },

    async fetchAll() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return;
      this.loading = true;
      try {
        const { data } = await notificationService.list();
        this.notifications = this._normalizeListResponse(data);
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
