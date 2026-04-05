import AppError from "../utils/AppError.js";
import Course from "../models/Course.js";

const writeAccessMiddleware = async (req, res, next) => {
    const { userId } = req.user;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    const isTeacher = course.teacherId?.equals(userId);
    const isAdmin = req.user.role === "admin";

    if (!isTeacher && !isAdmin) {
        return next(new AppError("You do not have permission to modify this course", 403));
    }

    next();
};

export default writeAccessMiddleware;