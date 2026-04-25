import http from '@/utils/http';

export const sampleService = {
  getPending: () => http.get('/sample-size/pending'),
  submit: (researchId, data) => http.post(`/sample-size/${researchId}`, data),
};

export default sampleService;
