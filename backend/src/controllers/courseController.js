import courseService from "../services/courseService.js";

const courseController = {
    async createCourse(req, res, next) {
        try{
            const teacherId = req.user.userId;
            const courseData = { ...req.body, teacherId };
            const course = await courseService.createCourse(courseData);
            res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: course
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getAllCourse(req, res, next) {
        try{
            const courses = await courseService.getAllCourse();
            res.status(200).json({
                success: true,
                message: "Courses retrieved successfully",
                data: courses
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getCourseById(req, res, next) {
        try{
            const {id} = req.params;
            const course = await courseService.getCourseById(id);
            res.status(200).json({
                success: true,
                message: "Course retrieved successfully",
                data: course
            })
        }
        catch(error){
            next(error);
        }
    },
    async updateCourse(req, res, next) {
        try{
            const {id} = req.params;
            const currentUser = req.user;
            const updateData = req.body;
            const course = await courseService.updateCourse(id, updateData, currentUser);
            res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });
        }
        catch(error){
            next(error);
        }
    },
    async deleteCourse(req, res, next) {
        try{
            const {id} = req.params;
            await courseService.deleteCourse(id);
            res.status(200).json({
                success: true,
                message: "Course deleted successfully"
            });
        }
        catch(error){
            next(error);
        }
    },
    async restoreCourse(req, res, next) {
        try{
            const {id} = req.params;
            await courseService.restoreCourse(id);
            res.status(200).json({
                success: true,
                message: "Course restored successfully"
            });
        }
        catch(error){
            next(error);
        }
    },
    async getCoursesByTeacher(req, res, next) {
        try{
            const {id} = req.params;
            const courses = await courseService.getCourseByTeacherId(id);
            res.status(200).json({
                success: true,
                message: "Courses retrieved successfully",
                data: courses
            });
        }
        catch(error){
            next(error);
        }
    },
    async enrollStudent(req, res, next) {
        try{
            const studentId = req.user.userId;
            const {id} = req.params;
            const course = await courseService.enrollStudent(id, studentId);
            res.status(200).json({
                success: true,
                message: "Enrolled in course successfully",
                data: course
            });
        }
        catch(error){
            next(error);
        }
    },
    async unenrollStudent(req, res, next) {
        try{
            const studentId = req.user.userId;
            const {id} = req.params;
            const course = await courseService.unenrollStudent(id, studentId);
            res.status(200).json({
                success: true,
                message: "Unenrolled from course successfully",
                data: course
            });
        }
        catch(error){
            next(error);
        }
    }
}

export default courseController;