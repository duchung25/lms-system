import apiClient from './apiClient';

export const orderApi = {   
    createOrder: (courseId) => {
        return apiClient.post(`/orders`, { courseId });
    },
    getOrderById: (orderId) => {
        return apiClient.get(`/orders/${orderId}`);
    },
    getAdminOrderDashboard: () => {
        return apiClient.get(`/orders/admin/dashboard`);
    },
    getTeacherOrderDashboard: () => {
        return apiClient.get(`/orders/teacher/dashboard`);
    }
};
