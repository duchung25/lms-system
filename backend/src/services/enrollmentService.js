import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import AppError from "../utils/AppError.js";

const enrollmentService = {
    async enrollInCourse(courseId, studentId){
        const course = await Course.findById(courseId);
        if(!course || !course.isPublished){
            throw new AppError("Course not found", 404);
        }
        const firstLesson = await Lesson.findOne({ courseId }).sort({ order: 1 }).select("_id").lean();
        const existing = await Enrollment.findOne({ courseId, studentId });
        if(existing){
            if(existing.status === "active"){
                throw new AppError("Already enrolled in this course", 400);
            }
            existing.status = "active";
            existing.cancelledAt = null;
            await existing.save();
            return existing;
        }
        const enrollment = await Enrollment.create({ courseId, studentId });
        return { enrollment,
                 firstLessonId: firstLesson ? firstLesson._id : null };
    },
    async unenrollFromCourse(courseId, studentId){
        const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" });
        if(!enrollment){
            throw new AppError("Enrollment not found", 404);
        }
        enrollment.status = "cancelled";
        enrollment.cancelledAt = new Date();
        await enrollment.save();
        return enrollment;
    },
    async getMyEnrollments(studentId){
        const enrollments = await Enrollment.find({ studentId, status: "active" })
                                            .populate({
                                                path: "courseId",
                                                select: "title description teacherId thumbnail price lever",
                                                populate: {
                                                    path: "teacherId",
                                                    select: "username email"
                                                }
                                            })
                                            .lean();
        return enrollments.map(e => e.courseId);
    },
    async getCourseEnrollments(courseId){
        return Enrollment.find({ courseId, status: "active" }).populate("studentId", "username email avatar").lean();
    }
};

export default enrollmentService;