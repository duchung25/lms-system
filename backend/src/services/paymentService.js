import Order from "../models/Order.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";

const paymentService = {
    async verifyPayment(orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new AppError("Order not found", 404);
        }
        if (order.status === "paid") {
            throw new AppError("Order already paid", 400);
        }
        order.status = "paid";
        order.paidAt = new Date();

        await order.save();
        const existedEnrollment = await Enrollment.findOne({
            courseId: order.courseId,
            studentId: order.studentId,
            status: "active"
        });
        if (!existedEnrollment) {
            await Enrollment.create({
                courseId: order.courseId,
                studentId: order.studentId
            });
            await Course.findByIdAndUpdate(order.courseId, {
                $inc: {
                    studentsCount: 1
                }
            });
        }
        return order;
    }
};

export default paymentService;