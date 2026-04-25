import http from '@/utils/http';

function getCookie(name) {
  if (typeof document === 'undefined') return '';
  const row = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
  if (!row) return '';
  const eqIndex = row.indexOf('=');
  return decodeURIComponent(row.substring(eqIndex + 1));
}

function withCookieAuth(extra = {}) {
  return {
    withCredentials: true,
    ...extra,
  };
}

function withCsrf(extra = {}) {
  const csrf = getCookie('IRB_CSRF_TOKEN');
  const headers = {
    ...(extra.headers || {}),
  };
  if (csrf) headers['X-CSRF-Token'] = csrf;

  return withCookieAuth({
    ...extra,
    headers,
  });
}

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
  pendingUsers(params = {}) {
    return http.get('/admin/users/pending', withCookieAuth({ params }));
  },
  activateUser(id) {
    return http.put(`/admin/users/${id}/activate`, {}, withCsrf());
  },
  rejectUser(id, reason = '') {
    return http.put(`/admin/users/${id}/reject`, { reason }, withCsrf());
  },
  allResearch(params = {}) {
    return http.get('/admin/research', withCookieAuth({ params }));
  },
  assignReviewer(researchId, reviewerId) {
    const payload = {
      reviewer_id: String(reviewerId),
    };
    const config = withCsrf();

    // Log request details for debugging
    // console.log('Assign Reviewer Request:', {
    //   url: `/admin/research/${researchId}/assign-reviewer`,
    //   payload,
    //   config,
    //   csrfToken: getCookie('IRB_CSRF_TOKEN'),
    //   cookies: document.cookie,
    // });

    return http.put(`/admin/research/${researchId}/assign-reviewer`, payload, config);
  },
  generateSerial(researchId) {
    return http.post(`/admin/research/${researchId}/serial`, {}, withCsrf());
  },
  activityLogs(params = {}) {
    return http.get('/admin/logs', withCookieAuth({ params }));
  },
  reviewers() {
    return http.get('/admin/reviewers', withCookieAuth());
  },

  // --- Manager ---
  managerReviewed(params = {}) {
    return http.get('/manager/research/reviewed', withCookieAuth({ params }));
  },
  managerResearch(id) {
    return http.get(`/manager/research/${id}`, withCookieAuth());
  },
  managerDecision(id, decision, note = '') {
    return http.put(`/manager/research/${id}/decision`, { decision, note }, withCsrf());
  },
  managerStats() {
    return http.get('/manager/dashboard/stats', withCookieAuth());
  },
  issueCertificate(id) {
    return http.post(`/manager/research/${id}/certificate`, {}, withCsrf());
  },
};
