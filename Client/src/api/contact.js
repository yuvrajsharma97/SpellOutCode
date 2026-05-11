import api from "./axiosInstance";

export const contactApi = {
  send: (username, payload) => api.post(`/users/${username}/contact`, payload),
};
