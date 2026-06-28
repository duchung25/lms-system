import Order from "../models/Order.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import LessonService from "./lessonService.js";
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

        const firstLesson = await LessonService.getFirstLesson(order.courseId);
        const firstLessonId = firstLesson?._id || null;

        const existedEnrollment = await Enrollment.findOne({
            courseId: order.courseId,
            studentId: order.studentId,
            status: "active"
        });
        if (!existedEnrollment) {
            await Enrollment.create({
                courseId: order.courseId,
                studentId: order.studentId,
                currentLessonId: firstLessonId,
                lastAccessedAt: firstLessonId ? new Date() : null
            });
            await Course.findByIdAndUpdate(order.courseId, {
                $inc: {
                    studentsCount: 1
                }
            });
        }
        return {
            order,
            courseId: order.courseId,
            firstLessonId
        };
    }
};

export default paymentService;