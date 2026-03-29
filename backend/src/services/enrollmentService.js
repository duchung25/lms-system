import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const enrollmentService = {
    async enrollInCourse(courseId, studentId){
        try{
            const course = await Course.findById(courseId);
            if(!course){
                throw new Error("Course not found");
            }
            const existing = await Enrollment.findOne({ courseId, studentId });
            if(existing){
                if(existing.status === "active"){
                    throw new Error("Already enrolled in this course");
                }
                existing.status = "active";
                existing.cancelledAt = null;
                await existing.save();
                return existing;
            }
            const enrollment = await Enrollment.create({ courseId, studentId });
            return enrollment;
        }
        catch(error){
            throw new Error("Failed to enroll in course: " + error.message);
        }
    },
    async unenrollFromCourse(courseId, studentId){
        try{
            const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" });
            if(!enrollment){
                throw new Error("Enrollment not found");
            }
            enrollment.status = "cancelled";
            enrollment.cancelledAt = new Date();
            await enrollment.save();
            return enrollment;
        }
        catch(error){
            throw new Error("Failed to unenroll from course: " + error.message);
        }
    },
    async getMyEnrollments(studentId){
        try{
            return Enrollment.find({ studentId, status: "active"}).populate("courseId", "title description teacherId").lean();
        }
        catch(error){
            throw new Error("Failed to get enrolled courses: " + error.message);
        }
    },
    async getCourseEnrollments(courseId){
        try{
            return Enrollment.find({ courseId, status: "active" }).populate("studentId", "username email avatar").lean();
        }
        catch(error){
            throw new Error("Failed to get course enrollments: " + error.message);
        }
    }
};

export default enrollmentService;