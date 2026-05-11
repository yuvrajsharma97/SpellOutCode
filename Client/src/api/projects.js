import api from "./axiosInstance";

export const projectsApi = {
  getByUsername: (username) => api.get(`/users/${username}/projects`),
  getBySlug: (username, slug) => api.get(`/users/${username}/projects/${slug}`),
  getMyProjects: () => api.get("/projects/mine"),
  create: (payload) => api.post("/projects", payload),
  update: (id, payload) => api.patch(`/projects/${id}`, payload),
  delete: (id) => api.delete(`/projects/${id}`),
};
