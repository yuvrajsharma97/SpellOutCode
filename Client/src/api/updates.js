import api from "./axiosInstance";

export const updatesApi = {
  getByProject: (username, slug) =>
    api.get(`/users/${username}/projects/${slug}/updates`),
  getById: (username, slug, updateId) =>
    api.get(`/users/${username}/projects/${slug}/updates/${updateId}`),
  getByProjectId: (projectId) => api.get(`/projects/${projectId}/updates`),
  create: (projectId, payload) =>
    api.post(`/projects/${projectId}/updates`, payload),
  update: (id, payload) => api.patch(`/updates/${id}`, payload),
  delete: (id) => api.delete(`/updates/${id}`),
};
