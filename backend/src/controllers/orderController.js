import orderService from "../services/orderService.js";

const orderController = {
    async createOrder(req, res, next) {
        try {
            const { courseId } = req.body;
            const order = await orderService.createOrder(courseId, req.user.userId);

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    },
    async getOrderById(req, res, next) {
        try {
            const { orderId } = req.params;
            const order = await orderService.getOrderById(orderId);
            return res.status(200).json({
                success: true,
                message: "Order retrieved successfully",
                data: order
            });
        } catch (error) {
            next(error);
        }
    },
    async getAdminOrderDashboard(req, res, next) {
        try {
            const dashboard = await orderService.getAdminOrderDashboard();
            res.status(200).json({
                success: true,
                message: "Dashboard retrieved successfully",
                data: dashboard
            });
        } catch (error) {
            next(error);
        }
    },
    async getTeacherOrderDashboard(req, res, next) {
        try{
            const dashboard = await orderService.getTeacherOrderDashboard(req.user.userId);
            res.status(200).json({
                success: true,
                message: "Dashboard retrieved successfully",
                data: dashboard
            });
        }catch (error) {
            next(error);
        }
    }
};

export default orderController;