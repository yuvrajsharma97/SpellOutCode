import api from "./axiosInstance";

export const profilesApi = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (payload) => api.patch("/users/me/updateProfile", payload),
  uploadAvatar: (formData) =>
    api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  removeAvatar: () => api.delete("/users/me/avatar"),
  deleteAccount: () => api.delete("/users/me"),
};
