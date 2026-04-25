import http from '@/utils/http';

/**
 * User files API (avatar, identity photos, ...).
 * Cookie-auth protected endpoints.
 */
export default {
  getMyAvatar() {
    return http.get('/users/me/avatar');
  },
  uploadMyAvatar(file) {
    const form = new FormData();
    form.append('avatar', file);
    return http.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
