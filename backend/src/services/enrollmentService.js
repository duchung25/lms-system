import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import AppError from "../utils/AppError.js";

const enrollmentService = {
    async enrollInCourse(courseId, studentId){
        const course = await Course.findById(courseId);
        if(!course || !course.active){
            throw new AppError("Course not found", 404);
        }
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
        return enrollment;
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
        return Enrollment.find({ studentId, status: "active"}).populate("courseId", "title description teacherId").lean();
    },
    async getCourseEnrollments(courseId){
        return Enrollment.find({ courseId, status: "active" }).populate("studentId", "username email avatar").lean();
    }
};

export default enrollmentService;