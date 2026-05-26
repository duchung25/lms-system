import courseService from "../services/courseService.js";
import enrollmentService from "../services/enrollmentService.js";
    
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
        try {
            const userRole = req.user.role;
            const {
            q, category, published, level, page, limit, sort, deleted
            } = req.query;
            let filterPublished;
            if(userRole.toLowerCase() === "admin") {
                filterPublished = typeof published !== 'undefined' ? published === 'true' : undefined;
            } else {
                filterPublished = true;
            }  
            const courses = await courseService.getAllCourse({
            q,
            category,
            level,
            published: filterPublished,
            deleted,
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            sort
            });

            res.status(200).json({
            success: true,
            message: 'Courses retrieved successfully',
            data: { courses }
            });
        } catch (error) {
            next(error);
        }
    },
    async getCourseDetail(req, res, next) {
        try{
            const user = req.user;
            const { courseId } = req.params;
            const course = await courseService.getCourseDetail(courseId, user);

            res.status(200).json({
                success: true,
                message: "Course retrieved successfully",
                data: { course  }
            })
        }
        catch(error){
            next(error);
        }
    },
    async updateCourse(req, res, next) {
        try{
            const { courseId } = req.params;
            const updateData = req.body;
            const course = await courseService.updateCourse(courseId, updateData);
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
    async getMyCourses(req, res, next) {
        try{
            const user = req.user.userId;
            let courses = [];
            if(req.user.role.toLowerCase() === "student"){
                courses = await enrollmentService.getMyEnrollments(user);
            } else if(req.user.role.toLowerCase() === "teacher"){
                courses = await courseService.getCourseByTeacherId(user);
            }   
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
    async setPublishStatus(req, res, next) {
        const courseId = req.params.courseId;
        const { status } = req.body;
        if(!["publish", "unpublish"].includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status value. Use 'publish' or 'unpublish'."
            });
        }
        try{
            const course = await courseService.setPublishStatus(courseId, status);
            res.status(200).json({
                success: true,
                message: status === "publish" ? "Course published successfully" : "Course unpublished successfully",
                data: { course }
            });
        }
        catch(error){
            next(error);
        }
    },
    async countHandler(req, res, next) {
        try {
            const counts = await courseService.countHandler();
            res.status(200).json({
                success: true,
                message: "Course counts retrieved successfully",
                data: counts
            });
        } catch (error) {
            next(error);
        }
    },
    async getDashboard(req, res, next) {
        try {
            const dashboard = await courseService.getCourseDashboard(req.user);

            res.status(200).json({
                success: true,
                message: "Dashboard retrieved successfully",
                data: dashboard
            });
        } catch (error) {
            next(error);
        }
    }
}

export default courseController;