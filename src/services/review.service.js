import http from '@/utils/http';

export const reviewService = {
  getAssigned: () => http.get('/reviews/assigned'),
  getArchived: () => http.get('/reviews/archived'),
  getDetail: (researchId, includeHistory = false) =>
    http.get(`/reviews/${researchId}`, { params: includeHistory ? { include_history: 1 } : {} }),
  addComment: (researchId, commentText) =>
    http.post(`/reviews/${researchId}/comment`, { comment_text: commentText }),
  submitDecision: (researchId, decision, comment) =>
    http.put(`/reviews/${researchId}/decision`, { decision, comment }),
};

export default reviewService;
