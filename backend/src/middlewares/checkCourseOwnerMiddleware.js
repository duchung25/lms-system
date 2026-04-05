// import AppError from "../utils/AppError";
// import Course from "../models/Course.js";

// const checkCourseOwnerMiddleware = async(req, res, next) => {
//     const courseId = req.params.courseId;
//     const { userId } = req.user;

//     const course = await Course.findById(courseId);
//     if (!course) {
//         return next(new AppError("Course not found", 404));
//     }
//     const owner = course.teacherId?.equals(userId);
//     if (!owner) {
//         return next(new AppError("You are not the owner of this course", 403));
//     }
//     next();
// };

// export default checkCourseOwnerMiddleware;