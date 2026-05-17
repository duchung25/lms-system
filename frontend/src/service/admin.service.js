import { adminApi } from "../api/admin.api";

export const adminService = {
  getAllUsers: async (params) => {
    const res = await adminApi.getAllUsers(params);
    return res.data?.data || [];
  }
};