import { defineStore } from 'pinia';
import { reviewService } from '@/services/review.service';

export const useReviewStore = defineStore('review', {
  state: () => ({
    assignedReviews: /** @type {Array<Record<string, any>>} */ ([]),
    currentReview: /** @type {null | Record<string, any>} */ (null),
    loading: false,
    error: '',
  }),

  actions: {
    async fetchAssigned() {
      this.loading = true;
      this.error = '';
      try {
        const response = await reviewService.getAssigned();
        this.assignedReviews = response?.data?.data?.data ?? [];
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر تحميل الأبحاث المسندة';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(researchId) {
      this.loading = true;
      this.error = '';
      try {
        const response = await reviewService.getDetail(researchId);
        this.currentReview = response?.data?.data ?? null;
        return this.currentReview;
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر تحميل تفاصيل البحث';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addComment(researchId, text) {
      this.error = '';
      try {
        const response = await reviewService.addComment(researchId, text);
        const comment = response?.data?.data?.data ?? null;
        if (comment && this.currentReview?.comments) {
          this.currentReview.comments.push(comment);
        }
        return comment;
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر إضافة التعليق';
        throw err;
      }
    },

    async submitDecision(researchId, decision, comment = '') {
      this.error = '';
      try {
        const response = await reviewService.submitDecision(researchId, decision, comment);

        this.assignedReviews = this.assignedReviews.filter(
          (item) => Number(item.id) !== Number(researchId),
        );

        if (
          this.currentReview?.research?.id &&
          Number(this.currentReview.research.id) === Number(researchId)
        ) {
          this.currentReview = null;
        }

        return response?.data?.data ?? null;
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر تسجيل القرار';
        throw err;
      }
    },
  },
});
