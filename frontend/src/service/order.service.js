import { orderApi } from "../api/order.api";

export const orderService = {
    async createOrder(courseId) {
        const res = await orderApi.createOrder(courseId);
        return res.data?.data ?? null;
    },
    async getOrderById(orderId) {
        const res = await orderApi.getOrderById(orderId);
        return res.data?.data ?? null;
    },
    async getAdminOrderDashboard() {
        const res = await orderApi.getAdminOrderDashboard();
        return res.data?.data ?? null;
    },
    async getTeacherOrderDashboard() {
        const res = await orderApi.getTeacherOrderDashboard();
        return res.data?.data ?? null;
    }
}