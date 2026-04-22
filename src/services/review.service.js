import http from '@/utils/http';

/**
 * DEV 3 — Review API.
 *   GET   /api/reviews/assigned
 *   GET   /api/reviews/{id}         (blind — no student PII)
 *   POST  /api/reviews/{id}/comment
 *   PUT   /api/reviews/{id}/decision
 */
export default {
  assigned() {
    return http.get('/reviews/assigned');
  },
  get(researchId) {
    return http.get(`/reviews/${researchId}`);
  },
  addComment(researchId, comment) {
    return http.post(`/reviews/${researchId}/comment`, { comment });
  },
  submitDecision(researchId, decision, note = '') {
    return http.put(`/reviews/${researchId}/decision`, { decision, note });
  },
};
