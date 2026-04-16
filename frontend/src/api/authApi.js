import api from "./axiosInstance";

export const loginApi = (credentials) => api.post("/auth/login", credentials);
export const registerApi = (data) => api.post("/auth/register", data);
export const getMeApi = () => api.get("/auth/me");
export const logoutApi = () => api.post("/auth/logout");
export const refreshApi = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });
