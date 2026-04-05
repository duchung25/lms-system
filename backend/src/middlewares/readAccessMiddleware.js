import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";

const canAccessCourse = async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = req.user.userId;

    const course = await Course.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    const isTeacher = course.teacherId?.equals(userId);
    const isAdmin = req.user.role === "admin";

    if(isTeacher || isAdmin) {
        return next();
    }

    const enrollment = await Enrollment.findOne({
        courseId,
        studentId: userId,
        status: "active"
    });

    if (!enrollment) {
        return next(new AppError("Access denied: you are not enrolled in this course", 403));
    }

    next();
};

export default canAccessCourse;