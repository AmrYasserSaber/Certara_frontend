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
    isAuthenticated: (s) => !!s.token && !!s.user,
    role: (s) => s.user?.role || null,
  },

  actions: {
    /** Called once from main.js before mount. Hydrates from localStorage. */
    boot() {
      if (this.booted) return;
      this.booted = true;
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
      if (token && userRaw) {
        try {
          this.token = token;
          this.user = JSON.parse(userRaw);
        } catch {
          this.reset();
        }
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await authService.login(credentials);
        this._persist(data);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'فشل تسجيل الدخول';
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
        if (data?.token && data?.user) {
          this._persist(data);
        }
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'فشل إنشاء الحساب';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      try {
        const { data } = await authService.me();
        this.user = data?.user || data;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      } catch {
        this.reset();
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
      this.token = token;
      this.user = user;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
  },
});
