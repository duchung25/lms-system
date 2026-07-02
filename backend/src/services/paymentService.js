import Order from "../models/Order.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import LessonService from "./lessonService.js";
import AppError from "../utils/AppError.js";
import notificationService from "./notificationService.js";

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
        let createdEnrollment = false;
        if (!existedEnrollment) {
            await Enrollment.create({
                courseId: order.courseId,
                studentId: order.studentId,
                currentLessonId: firstLessonId,
                lastAccessedAt: firstLessonId ? new Date() : null
            });
            createdEnrollment = true;
            await Course.findByIdAndUpdate(order.courseId, {
                $inc: {
                    studentsCount: 1
                }
            });
        }

        const course = await Course.findById(order.courseId).select("title").lean();
        await notificationService.createManyNotifications([
            {
                userId: order.studentId,
                title: "Thanh toán thành công",
                message: `Bạn đã thanh toán thành công khóa học ${course?.title || ""}.`.trim(),
                type: "PAYMENT_SUCCESSFUL",
                referenceId: order._id,
                referenceType: "Order",
                link: `/courses/${order.courseId}`,
            },
            ...(createdEnrollment
                ? [{
                    userId: order.studentId,
                    title: "Ghi danh thành công",
                    message: `Bạn đã được ghi danh vào khóa học ${course?.title || ""}.`.trim(),
                    type: "ENROLLMENT_SUCCESSFUL",
                    referenceId: order.courseId,
                    referenceType: "Course",
                    link: `/courses/${order.courseId}`,
                }]
                : []),
        ]);

        return {
            order,
            courseId: order.courseId,
            firstLessonId
        };
    }
};

export default paymentService;
