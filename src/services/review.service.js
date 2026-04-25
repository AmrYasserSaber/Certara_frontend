import http from '@/utils/http';

export const reviewService = {
  getAssigned: () => http.get('/reviews/assigned'),
  getDetail: (researchId) => http.get(`/reviews/${researchId}`),
  addComment: (researchId, commentText) =>
    http.post(`/reviews/${researchId}/comment`, { comment_text: commentText }),
  submitDecision: (researchId, decision, comment) =>
    http.put(`/reviews/${researchId}/decision`, { decision, comment }),
};

export default reviewService;
