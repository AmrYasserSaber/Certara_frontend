import http from '@/utils/http';

/**
 * DEV 5 — Notifications API.
 *   GET    /api/notifications
 *   PUT    /api/notifications/{id}/read
 *   PUT    /api/notifications/read-all
 */
export default {
  list() {
    return http.get('/notifications');
  },
  markRead(id) {
    return http.put(`/notifications/${id}/read`);
  },
  markAllRead() {
    return http.put('/notifications/read-all');
  },
};
