import Order from "../models/Order.js";
import Course from "../models/Course.js";
import AppError from "../utils/AppError.js";

const orderService = {
    async createOrder(courseId, studentId) {
        const course = await Course.findById(courseId);

        if (!course || course.status !== "PUBLISHED") {
            throw new AppError("Course not found", 404);
        }
        if (course.price <= 0) {
            throw new AppError("This course is free. Please enroll directly.", 400);
        }
        const paidOrder = await Order.findOne({
            studentId,
            courseId,
            status: "paid"
        });

        if (paidOrder) {
            throw new AppError("You already purchased this course", 400);
        }
        const pendingOrder = await Order.findOne({
            studentId,
            courseId,
            status: "pending"
        });
        if (pendingOrder) {
            return pendingOrder;
        }
        const order = await Order.create({ studentId, courseId, amount: course.price });
        return order;
    },
    async getOrderById(orderId) {
        const order = await Order.findById(orderId).populate("courseId", "title price");
        if (!order) {
            throw new AppError("Order not found", 404);
        }
        return order;
    },
    async getAdminOrderDashboard() {
        const [
            totalOrders,
            paidOrders,
            pendingOrders,
            failedOrders,
            cancelledOrders,
            revenue,
            revenueGrowth,
            paymentMethods
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: "paid" }),
            Order.countDocuments({ status: "pending" }),
            Order.countDocuments({ status: "failed" }),
            Order.countDocuments({ status: "cancelled" }),
            Order.aggregate([
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" }
                    }
                }
            ]),

            Order.aggregate([
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$paidAt" },
                            month: { $month: "$paidAt" }
                        },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            Order.aggregate([
                {
                    $group: {
                        _id: "$paymentMethod",
                        totalOrders: { $sum: 1 }
                    }
                }
            ])
        ]);
        return {
            overview: {
                totalOrders, paidOrders, pendingOrders, failedOrders, cancelledOrders,
                totalRevenue: revenue[0]?.totalRevenue ?? 0
            },

            charts: { revenueGrowth, paymentMethods }
        };
    },
    async getTeacherOrderDashboard(teacherId) {
        const teacherCourses = await Course.find({ teacherId }).select("_id").lean();
        const courseIds = teacherCourses.map(course => course._id);
        const orderFilter = { courseId: { $in: courseIds } };

        const [
            totalOrders,
            paidOrders,
            pendingOrders,
            failedOrders,
            cancelledOrders,
            revenue,
            revenueGrowth,
            topCourses
        ] = await Promise.all([
            Order.countDocuments(orderFilter),
            Order.countDocuments({
                ...orderFilter,
                status: "paid"
            }),
            Order.countDocuments({
                ...orderFilter,
                status: "pending"
            }),
            Order.countDocuments({
                ...orderFilter,
                status: "failed"
            }),
            Order.countDocuments({
                ...orderFilter,
                status: "cancelled"
            }),
            Order.aggregate([
                {
                    $match: {
                        ...orderFilter,
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" }
                    }
                }
            ]),
            Order.aggregate([
                {
                    $match: {
                        ...orderFilter,
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$paidAt" },
                            month: { $month: "$paidAt" }
                        },
                        revenue: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),
            Order.aggregate([
                {
                    $match: {
                        ...orderFilter,
                        status: "paid"
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                { $unwind: "$course" },
                {
                    $group: {
                        _id: "$course._id",
                        title: { $first: "$course.title" },
                        revenue: { $sum: "$amount" },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ])
        ]);

        return {
            overview: {
                totalOrders,
                paidOrders,
                pendingOrders,
                failedOrders,
                cancelledOrders,
                totalRevenue: revenue[0]?.totalRevenue ?? 0
            },
            charts: { revenueGrowth },  
            topCourses
        };
    }
};

export default orderService;
