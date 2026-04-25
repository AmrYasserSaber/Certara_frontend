import http from '@/utils/http';

/**
 * DEV 1 — Auth API.
 * Endpoints (see TEAM_DISTRIBUTION.md → API Contract):
 *   POST   /api/auth/register
 *   POST   /api/auth/login
 *   POST   /api/auth/logout
 *   GET    /api/auth/me
 */
export default {
  /**
   * Register a new student. `payload` is either a plain object or a FormData
   * (when uploading ID photos).
   */
  register(payload) {
    if (payload instanceof FormData) {
      return http.post('/auth/register', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return http.post('/auth/register', payload, { withCredentials: true });
  },

  login(credentials) {
    return http.post('/auth/login', credentials, { withCredentials: true });
  },

  logout() {
    return http.post('/auth/logout', {}, { withCredentials: true });
  },

  me() {
    return http.get('/auth/me', { withCredentials: true });
  },
};
