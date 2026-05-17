import apiClient from "./apiClient";

export const adminApi = {
  getAllUsers: (params) => {
    return apiClient.get("/admin/users", { params });
  }
};