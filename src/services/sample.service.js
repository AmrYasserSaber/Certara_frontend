import http from '@/utils/http';

/**
 * DEV 3 — Sample Size API.
 *   GET   /api/sample-size/pending
 *   POST  /api/sample-size/{research_id}
 */
export default {
  pending() {
    return http.get('/sample-size/pending');
  },
  submit(researchId, payload) {
    return http.post(`/sample-size/${researchId}`, payload);
  },
};
