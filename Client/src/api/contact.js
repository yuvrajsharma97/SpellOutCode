import api from "./axiosInstance";

export const contactApi = {
  send: (projectId, payload) =>
    api.post(`/contact/contactProjectAuthor/${projectId}`, payload),
};
