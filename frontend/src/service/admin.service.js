import { adminApi } from "../api/admin.api";

export const adminService = {
  getAllUsers: async (params) => {
    const res = await adminApi.getAllUsers(params);
    return res.data?.data || [];
  },
  deleteUser: async (userId) => {
    const res = await adminApi.deleteUser(userId);
    return res.data;
  },
  restoreUser: async (userId) => {
    const res = await adminApi.restoreUser(userId);
    return res.data;
  },
  deactivateUser: async (userId) => {
    const res = await adminApi.deactivateUser(userId);
    return res.data;
  },
  resetPassword: async (userId, newPassword) => {
    const res = await adminApi.resetPassword(userId, newPassword);
    return res.data;
  },
  getDashboardStatistics: async () => {
    const res = await adminApi.getDashboardStatistics();
    return res.data?.data || {};
  },
  getCourseDashboard: async () => {
    const res = await adminApi.getCourseDashboard();
    return res.data?.data || {};
  },
};