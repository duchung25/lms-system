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
                data: { course }
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
                data: { courses }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getPublishedCourses(req, res, next) {
        try{
            const courses = await courseService.getPublishedCourses();
            res.status(200).json({
                success: true,
                message: "Published courses retrieved successfully",
                data: { courses }
            });
        }
        catch (error) {
            next(error);

        }
    },
    async getCourseById(req, res, next) {
        try{
            const { courseId } = req.params;
            const course = await courseService.getCourseById(courseId);
            res.status(200).json({
                success: true,
                message: "Course retrieved successfully",
                data: { course }
            })
        }
        catch(error){
            next(error);
        }
    },
    async updateCourse(req, res, next) {
        try{
            const { courseId } = req.params;
            const currentUser = req.user;
            const updateData = req.body;
            const course = await courseService.updateCourse(courseId, updateData, currentUser);
            res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: { course }
            });
        }
        catch(error){
            next(error);
        }
    },
    async deleteCourse(req, res, next) {
        try{
            const { courseId } = req.params;
            await courseService.deleteCourse(courseId);
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
            const { courseId } = req.params;
            await courseService.restoreCourse(courseId);
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
            const { teacherId } = req.params;
            const courses = await courseService.getCourseByTeacherId(teacherId);
            res.status(200).json({
                success: true,
                message: "Courses retrieved successfully",
                data: { courses }
            });
        }
        catch(error){
            next(error);
        }
    },
    async publishCourse(req, res, next) {
        const courseId = req.params.courseId;
        try{
            await courseService.publishCourse(courseId);
            res.status(200).json({
                success: true,
                message: "Course published successfully",
                data: null
            });
        }
        catch(error){
            next(error);
        }
    },
    async unpublishCourse(req, res, next) {
        const courseId = req.params.courseId;
        try{
            await courseService.unpublishCourse(courseId);
            res.status(200).json({
                success: true,
                message: "Course unpublished successfully",
                data: null
            });
        }
        catch(error){
            next(error);
        }
    }
}

export default courseController;