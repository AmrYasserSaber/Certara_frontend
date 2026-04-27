import { defineStore } from 'pinia';
import { reviewService } from '@/services/review.service';
import researchService from '@/services/research.service';

function unwrapData(payload) {
  let current = payload;
  while (current && typeof current === 'object' && 'data' in current) {
    current = current.data;
  }
  return current;
}

export const useReviewStore = defineStore('review', {
  state: () => ({
    assignedReviews: /** @type {Array<Record<string, any>>} */ ([]),
    archivedReviews: /** @type {Array<Record<string, any>>} */ ([]),
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
        const assigned = unwrapData(response?.data);
        this.assignedReviews = Array.isArray(assigned) ? assigned : [];
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر تحميل الأبحاث المسندة';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchArchived() {
      this.loading = true;
      this.error = '';
      try {
        const response = await reviewService.getArchived();
        const archived = unwrapData(response?.data);
        this.archivedReviews = Array.isArray(archived) ? archived : [];
      } catch (err) {
        this.error = err.response?.data?.error?.message || 'تعذر تحميل الأبحاث المؤرشفة';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(researchId, includeHistory = false) {
      this.loading = true;
      this.error = '';
      try {
        const [detailResponse, documentsResponse] = await Promise.all([
          reviewService.getDetail(researchId, includeHistory),
          researchService.listDocuments(researchId).catch(() => null),
        ]);

        const detail = unwrapData(detailResponse?.data) ?? null;
        const docsPayload = unwrapData(documentsResponse?.data);
        const fetchedDocuments = docsPayload?.documents ?? docsPayload ?? detail?.documents ?? [];

        this.currentReview = detail
          ? {
              ...detail,
              documents: Array.isArray(fetchedDocuments) ? fetchedDocuments : [],
            }
          : null;

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
