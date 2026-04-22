import { defineStore } from 'pinia';
import reviewService from '@/services/review.service';
import { sanitizeResearchForReviewer } from '@/utils/helpers';

/** DEV 3 — Review store (blind-review safe). */
export const useReviewStore = defineStore('review', {
  state: () => ({
    assigned: [],
    current: null,
    loading: false,
    submitting: false,
    error: '',
  }),

  actions: {
    async fetchAssigned() {
      this.loading = true;
      try {
        const { data } = await reviewService.assigned();
        this.assigned = (Array.isArray(data) ? data : (data?.items ?? [])).map(
          sanitizeResearchForReviewer,
        );
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل الأبحاث المسندة';
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id) {
      this.loading = true;
      try {
        const { data } = await reviewService.get(id);
        this.current = sanitizeResearchForReviewer(data?.research || data);
        return this.current;
      } finally {
        this.loading = false;
      }
    },

    async addComment(id, comment) {
      const { data } = await reviewService.addComment(id, comment);
      return data;
    },

    async submitDecision(id, decision, note = '') {
      this.submitting = true;
      try {
        const { data } = await reviewService.submitDecision(id, decision, note);
        return data;
      } finally {
        this.submitting = false;
      }
    },

    reset() {
      this.assigned = [];
      this.current = null;
      this.error = '';
    },
  },
});
