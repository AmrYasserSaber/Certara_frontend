import http from '@/utils/http';

/**
 * DEV 4 — Admin + Manager + Certificate APIs.
 *   Admin:
 *     GET   /api/admin/users/pending
 *     PUT   /api/admin/users/{id}/activate
 *     PUT   /api/admin/users/{id}/reject
 *     GET   /api/admin/research
 *     PUT   /api/admin/research/{id}/assign-reviewer
 *     POST  /api/admin/research/{id}/serial
 *     GET   /api/admin/logs
 *     GET   /api/admin/reviewers
 *   Manager:
 *     GET   /api/manager/research/reviewed
 *     GET   /api/manager/research/{id}
 *     PUT   /api/manager/research/{id}/decision
 *     GET   /api/manager/dashboard/stats
 *     POST  /api/manager/research/{id}/certificate
 */
export default {
  // --- Admin ---
  pendingUsers() {
    return http.get('/admin/users/pending');
  },
  activateUser(id) {
    return http.put(`/admin/users/${id}/activate`);
  },
  rejectUser(id, reason = '') {
    return http.put(`/admin/users/${id}/reject`, { reason });
  },
  allResearch(params = {}) {
    return http.get('/admin/research', { params });
  },
  assignReviewer(researchId, reviewerId) {
    return http.put(`/admin/research/${researchId}/assign-reviewer`, {
      reviewer_id: reviewerId,
    });
  },
  generateSerial(researchId) {
    return http.post(`/admin/research/${researchId}/serial`);
  },
  activityLogs(params = {}) {
    return http.get('/admin/logs', { params });
  },
  reviewers() {
    return http.get('/admin/reviewers');
  },

  // --- Manager ---
  managerReviewed(params = {}) {
    return http.get('/manager/research/reviewed', { params });
  },
  managerResearch(id) {
    return http.get(`/manager/research/${id}`);
  },
  managerDecision(id, decision, note = '') {
    return http.put(`/manager/research/${id}/decision`, { decision, note });
  },
  managerStats() {
    return http.get('/manager/dashboard/stats');
  },
  issueCertificate(id) {
    return http.post(`/manager/research/${id}/certificate`);
  },
};
