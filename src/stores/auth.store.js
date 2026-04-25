import { defineStore } from 'pinia';
import authService from '@/services/auth.service';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * DEV 1 — Auth store.
 * Cookie-based auth:
 * - Access/refresh tokens are HttpOnly cookies (not readable by JS).
 * - We optionally cache the safe user payload in localStorage for quick boot,
 *   but we validate via /auth/me.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: /** @type {null | Object} */ (null),
    loading: false,
    error: '',
    booted: false,
    sessionChecked: false,
  }),

  getters: {
    isAuthenticated: (s) => s.sessionChecked && !!s.user,
    role: (s) => s.user?.role || null,
  },

  actions: {
    /** Called once from main.js before mount. Hydrates cached user (optional). */
    boot() {
      if (this.booted) return;
      this.booted = true;
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
      if (userRaw) {
        try {
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
        if (payload?.user) {
          this.user = payload.user;
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        }
        await this.fetchMe();
        return payload;
      } catch (err) {
        const code = err?.response?.data?.error?.code || '';
        if (code === 'account_inactive') {
          this.error = 'حسابك قيد التفعيل من الإدارة. سيتم إشعارك فور تفعيله.';
          throw err;
        }
        this.error =
          err?.response?.data?.error?.message || err?.response?.data?.message || 'فشل تسجيل الدخول';
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
        // Registration does NOT create a login session (no auth cookies).
        // Keep the app unauthenticated; user must login after activation.
        this.user = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        this.sessionChecked = false;
        return normalized;
      } catch (err) {
        this.error =
          err?.response?.data?.error?.message || err?.response?.data?.message || 'فشل إنشاء الحساب';
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
        if (this.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        if (!this.user) localStorage.removeItem(STORAGE_KEYS.USER);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) this.reset();
      } finally {
        this.sessionChecked = true;
      }
    },

    /** Ensures the current cookie session is validated exactly once. */
    async ensureSession() {
      if (this.sessionChecked) return;
      await this.fetchMe();
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
      this.error = '';
      localStorage.removeItem(STORAGE_KEYS.USER);
      this.sessionChecked = false;
    },

    _extractPayload(responseBody) {
      if (responseBody && typeof responseBody === 'object' && 'data' in responseBody) {
        return responseBody.data || {};
      }
      return responseBody || {};
    },
  },
});
