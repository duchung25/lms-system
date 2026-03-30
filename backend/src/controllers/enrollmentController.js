import enrollmentService from "../services/enrollmentService.js";

const enrollmentController = {
    async enrollInCourse(req, res, next) {
        try{
            const studentId = req.user.userId;
            const { courseId } = req.body;
            const enrollment = await enrollmentService.enrollInCourse(courseId, studentId);
            res.status(200).json({
                success: true,
                message: "Enrolled in course successfully",
                data: { enrollment }
            });
        }
        catch(error){
            next(error);
        }
    },
    async unenrollFromCourse(req, res, next) {
        try{
            const studentId = req.user.userId;
            const { courseId } = req.params;
            const enrollment = await enrollmentService.unenrollFromCourse(courseId, studentId);
            res.status(200).json({
                success: true,
                message: "Unenrolled from course successfully",
                data: { enrollment }
            });
        }
        catch(error){
            next(error);   
        }
    },
    async getMyEnrollments(req, res, next) {
        try{
            const studentId = req.user.userId;
            const enrollments = await enrollmentService.getMyEnrollments(studentId);
            res.status(200).json({
                success: true,
                message: "Enrolled courses retrieved successfully",
                data: { enrollments }
            });
        }
        catch(error){
            next(error);
        }
    },
    async getCourseEnrollments(req, res, next) {
        try{
            const { courseId } = req.params;
            const enrollments = await enrollmentService.getCourseEnrollments(courseId);
            res.status(200).json({
                success: true,
                message: "Course enrollments retrieved successfully",
                data: { enrollments }
            });
        }
        catch(error){
            next(error);
        }
    }
};

export default enrollmentController;