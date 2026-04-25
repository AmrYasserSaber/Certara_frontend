import http from '@/utils/http';

/**
 * DEV 2 — Research API.
 *   POST   /api/research
 *   GET    /api/research
 *   GET    /api/research/{id}
 *   PUT    /api/research/{id}
 *   DELETE /api/research/{id}
 *   POST   /api/research/{id}/documents
 *   GET    /api/research/{id}/documents
 *   DELETE /api/research/{id}/documents/{doc_id}
 */
export default {
  list(params = {}) {
    return http.get('/research', { params });
  },
  get(id) {
    return http.get(`/research/${id}`);
  },
  create(payload) {
    return http.post('/research', payload);
  },
  update(id, payload) {
    return http.patch(`/research/${id}`, payload);
  },
  remove(id) {
    return http.delete(`/research/${id}`);
  },
  listDocuments(id) {
    return http.get(`/research/${id}/documents`);
  },
  uploadDocuments(id, formData) {
    return http.post(`/research/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument(researchId, docId) {
    return http.delete(`/research/${researchId}/documents/${docId}`);
  },
  getCertificate(id) {
    return http.get(`/research/${id}/certificate`, { responseType: 'blob' });
  },
};
