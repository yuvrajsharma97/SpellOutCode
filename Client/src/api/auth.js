import api from "../api/axiosInstance";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),

  login: (payload) => api.post("/auth/login", payload),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),

  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),

  resetPassword: (token, payload) =>
    api.post(`/auth/reset-password/${token}`, payload),

  changePassword: (payload) => api.patch("/auth/change-password", payload),
};
