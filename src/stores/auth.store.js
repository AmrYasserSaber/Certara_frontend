import { defineStore } from 'pinia';
import authService from '@/services/auth.service';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * DEV 1 — Auth store.
 * Persists token and user in localStorage so reloads keep you signed in.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: /** @type {null | Object} */ (null),
    token: /** @type {null | string} */ (null),
    loading: false,
    error: '',
    booted: false,
  }),

  getters: {
    isAuthenticated: (s) => !!s.user,
    role: (s) => s.user?.role || null,
  },

  actions: {
    /** Called once from main.js before mount. Hydrates from localStorage. */
    async boot() {
      if (this.booted) return;
      this.booted = true;

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
      if (token && userRaw) {
        try {
          this.token = token;
          this.user = JSON.parse(userRaw);
          return;
        } catch {
          this.reset();
        }
      }

      // Cookie-based auth fallback: restore session from backend cookies.
      // await this.fetchMe();
    },

    async login(credentials) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await authService.login(credentials);
        const payload = this._extractPayload(data);
        this._persist(payload);
        // Ensure fresh profile from server/cookies.
        await this.fetchMe();
        return payload;
      } catch (err) {
        this.error =
          err.response?.data?.error?.message || err.response?.data?.message || 'فشل تسجيل الدخول';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(payload) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await authService.register(payload);
        const normalized = this._extractPayload(data);
        // Register endpoint may return only user (no login session).
        if (normalized?.user) this.user = normalized.user;
        return normalized;
      } catch (err) {
        this.error =
          err.response?.data?.error?.message || err.response?.data?.message || 'فشل إنشاء الحساب';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      try {
        const { data } = await authService.me();
        const payload = this._extractPayload(data);
        this.user = payload?.user || null;
        if (this.user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        }
      } catch {
        // this.reset();
              // Only clear credentials on auth failures, not transient errors
       if (err.response?.status === 401 || err.response?.status === 403) {
         this.reset();
       }
      }
    },

    async logout() {
      try {
        await authService.logout();
      } catch {
        // Continue even if the API call fails — clear the session locally.
      } finally {
        this.reset();
      }
    },

    reset() {
      this.user = null;
      this.token = null;
      this.error = '';
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },

    _persist({ token, user }) {
      this.token = token || null;
      this.user = user || null;

      if (this.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
      } else {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }

      if (this.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    },

    _extractPayload(responseBody) {
      // API envelope: { success, data, error, meta }
      if (responseBody && typeof responseBody === 'object' && 'data' in responseBody) {
        return responseBody.data || {};
      }
      return responseBody || {};
    },
  },
});
