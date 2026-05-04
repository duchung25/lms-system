import enrollmentService from "../services/enrollmentService.js";

const enrollmentController = {
    async enrollInCourse(req, res, next) {
        try{
            const studentId = req.user.userId;
            const { courseId } = req.params;
            const { enrollment, firstLessonId, currentLessonId } = await enrollmentService.enrollInCourse(courseId, studentId);
            res.status(201).json({
                success: true,
                message: "Enrolled in course successfully",
                data: { 
                    enrollment,
                    firstLessonId,
                    currentLessonId
                 }
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
    async getMyEnrolledCourses(req, res, next) {
        try{
            const studentId = req.user.userId;
            const courses = await enrollmentService.getMyEnrollments(studentId);
            res.status(200).json({
                success: true,
                message: "Enrolled courses retrieved successfully",
                data: { courses }
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
    },
    async updateLearningProgress(req, res, next) {
        try{
            const studentId = req.user.userId;
            const { courseId } = req.params;
            const { lessonId } = req.body;
            const enrollment = await enrollmentService.updateLearningProgress(courseId, studentId, lessonId);
            res.status(200).json({
                success: true,
                message: "Learning progress updated successfully",
                data: { enrollment }
            });
        }
        catch(error){
            next(error);
        }
    },
    async completeLesson(req, res, next) {
        try{
            const studentId = req.user.userId;
            const { courseId, lessonId } = req.params;
            const result = await enrollmentService.completeLesson(courseId, studentId, lessonId);
            res.status(200).json({
                success: true,
                message: "Lesson completed successfully",
                data: result
            });
        }
        catch(error){
            next(error);
        }
    }
};

export default enrollmentController;
