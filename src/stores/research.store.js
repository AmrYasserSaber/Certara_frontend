import { defineStore } from 'pinia';
import researchService from '@/services/research.service';

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
        const { data } = await researchService.list(params);
        this.list = Array.isArray(data) ? data : (data?.items ?? []);
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل الأبحاث';
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id) {
      this.loading = true;
      try {
        const { data } = await researchService.get(id);
        this.current = data?.research || data;
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
        const { data } = await researchService.create(payload);
        this.current = data?.research || data;
        return this.current;
      } finally {
        this.saving = false;
      }
    },

    async update(id, payload) {
      this.saving = true;
      try {
        const { data } = await researchService.update(id, payload);
        this.current = data?.research || data;
        return this.current;
      } finally {
        this.saving = false;
      }
    },

    async uploadDocuments(id, formData) {
      const { data } = await researchService.uploadDocuments(id, formData);
      return data;
    },

    reset() {
      this.list = [];
      this.current = null;
      this.error = '';
    },
  },
});
