import api from "./axiosInstance";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),
  changePassword: (payload) => api.patch("/auth/change-password", payload),
};
