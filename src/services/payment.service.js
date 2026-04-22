import http from '@/utils/http';

/**
 * DEV 2 — Payment API.
 *   POST  /api/research/{id}/payment
 *   GET   /api/research/{id}/payment/receipt
 */
export default {
  initiate(researchId, payload) {
    return http.post(`/research/${researchId}/payment`, payload);
  },
  getReceipt(researchId, paymentId) {
    const url = paymentId
      ? `/research/${researchId}/payment/${paymentId}/receipt`
      : `/research/${researchId}/payment/receipt`;
    return http.get(url);
  },
};
