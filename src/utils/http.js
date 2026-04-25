import axios from 'axios';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Shared Axios instance.
 * DEV 1 owns this file — ALL devs import this instance, never modify it.
 *
 * Responsibilities:
 *  - prepend `VITE_API_BASE_URL`
 *  - attach `Authorization: Bearer <token>` from localStorage
 *  - on 401 → clear auth + redirect to /login
 *  - toast any 5xx (via lazy-loaded composable to avoid a cycle with pinia)
 */

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// -------- Request: attach JWT ------------------------------------------------
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Response: 401 / 5xx handling --------------------------------------
let handling401 = false;

async function showErrorToast(message) {
  try {
    const { useToast } = await import('@/composables/useToast');
    useToast().error(message);
  } catch {
    // swallow — toast system not ready yet
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      await showErrorToast('تعذر الاتصال بالخادم. يرجى التحقق من الشبكة.');
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Log all errors to console for debugging
    if (status === 422 || status >= 400) {
      // console.error(`HTTP ${status} Error:`, {
      //   url: error.config?.url,
      //   method: error.config?.method,
      //   data: error.config?.data,
      //   headers: error.config?.headers,
      //   response: error.response?.data,
      // });
    }

    if (status === 401 && !handling401) {
      handling401 = true;
      try {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        const { useAuthStore } = await import('@/stores/auth.store');
        useAuthStore().reset();
        const current = window.location.pathname;
        if (!current.startsWith('/login')) {
          window.location.assign(
            `/login?redirect=${encodeURIComponent(current + window.location.search)}`,
          );
        }
      } finally {
        setTimeout(() => {
          handling401 = false;
        }, 1500);
      }
    } else if (status === 403) {
      await showErrorToast('ليس لديك صلاحية الوصول إلى هذا الإجراء.');
    } else if (status >= 500) {
      await showErrorToast('حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.');
    }

    return Promise.reject(error);
  },
);

export default http;
