import apiClient from "./apiClient";

export const userApi = {
    getUsers: (params) => {
        return apiClient.get("/admin/users", { params });
    },
    createUser: (userData) => {
        return apiClient.post("/admin/users", userData);
    },
    getUserDetail: (userId) => {
        return apiClient.get(`/admin/users/${userId}`);
    },
    updateUser: (userId, updateData) => {
        return apiClient.patch(`/admin/users/${userId}`, updateData);
    },
    deleteUser: (userId) => {
        return apiClient.delete(`/admin/users/${userId}`);
    },
    restoreUser: (userId) => {
        return apiClient.patch(`/admin/users/${userId}/restore`);
    }
    // 
}