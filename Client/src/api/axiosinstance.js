import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post( `${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        window.dispatchEvent(new CustomEvent("auth:expired"));
        return Promise.reject(error);
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong.";

    return Promise.reject(new Error(message));
  },
);

export default api;
