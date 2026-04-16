import api from "./axiosInstance";

export const getUsersApi = (params) => api.get("/users", { params });
export const getUserByIdApi = (id) => api.get(`/users/${id}`);
export const createUserApi = (data) => api.post("/users", data);
export const updateUserApi = (id, data) => api.put(`/users/${id}`, data);
export const deleteUserApi = (id) => api.delete(`/users/${id}`);
export const toggleUserStatusApi = (id) => api.patch(`/users/${id}/status`);
export const updateOwnProfileApi = (data) => api.patch("/users/profile", data);
