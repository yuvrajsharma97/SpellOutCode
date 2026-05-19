import api from "./axiosInstance";

export const projectsApi = {
  getByUsername: (username) => api.get(`/users/${username}/projects`),
  getBySlug: (username, slug) => api.get(`/users/${username}/projects/${slug}`),
  getMyProjects: () => api.get("/projects/my-projects"),
  create: (payload) => api.post("/projects/create-new-project", payload),
  update: (id, payload) => api.patch(`/projects/${id}`, payload),
  delete: (id) => api.delete(`/projects/${id}`),
};
