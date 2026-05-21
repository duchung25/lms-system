import apiClient from "./apiClient";

export const adminApi = {
  getAllUsers: (params) => {
    return apiClient.get("/admin/users", { params });
  },
  deleteUser: (userId) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },
  restoreUser: (userId) => {
    return apiClient.patch(`/admin/users/${userId}/restore`);
  },
  deactivateUser: (userId) => {
    return apiClient.patch(`/admin/users/${userId}/deactivate`);
  },
  resetPassword: (userId, newPassword) => {
    return apiClient.patch(`/admin/users/${userId}/reset-password`, { newPassword });
  },
  getDashboardStatistics: () => {
    return apiClient.get("/admin/dashboard/statistics");
  }
};
