import { defineStore } from 'pinia';
import adminService from '@/services/admin.service';

/** DEV 4 — Admin + Manager shared store. */
export const useAdminStore = defineStore('admin', {
  state: () => ({
    pendingUsers: [],
    researchList: [],
    logs: [],
    reviewers: [],
    managerQueue: [],
    managerStats: null,
    currentResearch: null,
    loading: false,
    error: '',
  }),

  actions: {
    async fetchPendingUsers() {
      this.loading = true;
      try {
        const { data } = await adminService.pendingUsers();
        this.pendingUsers = Array.isArray(data) ? data : (data?.items ?? []);
      } catch (err) {
        this.error = err.response?.data?.message || 'تعذر تحميل المستخدمين';
      } finally {
        this.loading = false;
      }
    },

    async activateUser(id) {
      await adminService.activateUser(id);
      this.pendingUsers = this.pendingUsers.filter((u) => u.id !== id);
    },

    async rejectUser(id, reason) {
      await adminService.rejectUser(id, reason);
      this.pendingUsers = this.pendingUsers.filter((u) => u.id !== id);
    },

    async fetchResearchList(params = {}) {
      this.loading = true;
      try {
        const { data } = await adminService.allResearch(params);
        this.researchList = Array.isArray(data) ? data : (data?.items ?? []);
      } finally {
        this.loading = false;
      }
    },

    async fetchLogs(params = {}) {
      this.loading = true;
      try {
        const { data } = await adminService.activityLogs(params);
        this.logs = Array.isArray(data) ? data : (data?.items ?? []);
      } finally {
        this.loading = false;
      }
    },

    async fetchReviewers() {
      const { data } = await adminService.reviewers();
      this.reviewers = Array.isArray(data) ? data : (data?.items ?? []);
    },

    async assignReviewer(researchId, reviewerId) {
      return adminService.assignReviewer(researchId, reviewerId);
    },

    // --- Manager ---
    async fetchManagerQueue() {
      this.loading = true;
      try {
        const { data } = await adminService.managerReviewed();
        this.managerQueue = Array.isArray(data) ? data : (data?.items ?? []);
      } finally {
        this.loading = false;
      }
    },

    async fetchManagerStats() {
      const { data } = await adminService.managerStats();
      this.managerStats = data || null;
    },

    async fetchManagerResearch(id) {
      const { data } = await adminService.managerResearch(id);
      this.currentResearch = data?.research || data;
      return this.currentResearch;
    },

    async submitManagerDecision(id, decision, note) {
      return adminService.managerDecision(id, decision, note);
    },

    async issueCertificate(id) {
      return adminService.issueCertificate(id);
    },
  },
});
