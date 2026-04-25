import { defineStore } from 'pinia';
import researchService from '@/services/research.service';
import paymentService from '@/services/payment.service';

/**
 * DEV 2 — Research store. Filled in by the owning dev; the scaffold provides
 * the actions and state each view will need so other devs can integrate.
 */
export const useResearchStore = defineStore('research', {
  state: () => ({
    list: [],
    current: null,
    loading: false,
    saving: false,
    error: '',
  }),

  getters: {
    draftCount: (s) => s.list.filter((r) => r.status === 'draft').length,
  },

  actions: {
    async fetchList(params = {}) {
      this.loading = true;
      try {
        const { data: body } = await researchService.list(params);
        this.list = body?.data ?? (Array.isArray(body) ? body : []);
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل الأبحاث';
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id) {
      this.loading = true;
      try {
        const { data: body } = await researchService.get(id);
        this.current = body?.data || body?.research || body;
        return this.current;
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل البحث';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      this.saving = true;
      try {
        const { data: body } = await researchService.create(payload);
        this.current = body?.data || body?.research || body;
        return this.current;
      } finally {
        this.saving = false;
      }
    },

    async update(id, payload) {
      this.saving = true;
      try {
        const { data: body } = await researchService.update(id, payload);
        this.current = body?.data || body?.research || body;
        return this.current;
      } finally {
        this.saving = false;
      }
    },

    async uploadDocuments(id, formData) {
      const { data } = await researchService.uploadDocuments(id, formData);
      return data;
    },

    async submitPayment(researchId, payload) {
      this.saving = true;
      try {
        const { data } = await paymentService.initiate(researchId, payload);
        await this.fetchOne(researchId);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر معالجة الدفع';
        throw err;
      } finally {
        this.saving = false;
      }
    },

    reset() {
      this.list = [];
      this.current = null;
      this.error = '';
    },
  },
});
