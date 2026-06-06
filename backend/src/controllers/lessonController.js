import LessonService from '../services/lessonService.js';
import lessonProgressService from '../services/lessonProgressService.js';

const LessonController = {
    async createLesson(req, res, next){
        try{
            const courseId = req.params.courseId;
            const { userId } = req.user;
            const lesson = await LessonService.createLesson(courseId, req.body, userId);
            res.status(201).json({
                success: true,
                message: "Lesson created successfully",
                data: { lesson }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getLessonsByCourse(req, res, next){
        try{
            const user = req.user;
            const courseId = req.params.courseId;
            const lessons = await LessonService.getLessonsByCourse(courseId, user);
            res.status(200).json({
                success: true,
                message: "Lessons retrieved successfully",
                data: { lessons }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getPublishedLessonsByCourse(req, res, next){
        try{
            const courseId = req.params.courseId;
            const lessons = await LessonService.getPublishedLessonsByCourse(courseId);
            res.status(200).json({
                success: true,
                message: "Published lessons retrieved successfully",
                data: { lessons }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getLessonDetail(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const courseId = req.params.courseId;
            const lesson = await LessonService.getLessonDetail(courseId, lessonId, req.user);
            res.status(200).json({
                success: true,
                message: "Lesson retrieved successfully",
                data: { lesson }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async updateLesson(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const { userId } = req.user;
            const lesson = await LessonService.updateLesson(lessonId, req.body, userId);
            res.status(200).json({
                success: true,
                message: "Lesson updated successfully",
                data: { lesson }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async deleteLesson(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const { userId } = req.user;
            const result = await LessonService.deleteLesson(lessonId, userId);
            res.status(200).json({
                success: true,
                message: result.message
            });
        }
        catch (error) {
            next(error);
        }
    },
    async restoreLesson(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const { userId } = req.user;
            const result = await LessonService.restoreLesson(lessonId, userId);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async publishLesson(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const lesson = await LessonService.publishLesson(lessonId);
            res.status(200).json({
                success: true,
                message: "Lesson published successfully",
                data: null
            });
        }
        catch (error) {
            next(error);
        }
    },
    async unpublishLesson(req, res, next){
        try{
            const lessonId = req.params.lessonId;
            const lesson = await LessonService.unpublishLesson(lessonId);
            res.status(200).json({
                success: true,
                message: "Lesson unpublished successfully",
                data: null
            });
        }
        catch (error) {
            next(error);
        }
    },
    async completeLesson(req, res, next){
        try{
            const { courseId, lessonId } = req.params;
            const result = await lessonProgressService.markLessonCompleted(
                courseId,
                req.user.userId,
                lessonId
            );
            res.status(200).json({
                success: true,
                message: "Lesson completed successfully",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getCourseProgress(req, res, next){
        try{
            const { courseId } = req.params;
            const progress = await lessonProgressService.getCourseProgress(
                courseId,
                req.user.userId
            );
            res.status(200).json({
                success: true,
                message: "Course progress retrieved successfully",
                data: { progress }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getUnlockedLessons(req, res, next){
        try{
            const { courseId } = req.params;
            const lessons = await lessonProgressService.getUnlockedLessons(
                courseId,
                req.user.userId
            );
            res.status(200).json({
                success: true,
                message: "Unlocked lessons retrieved successfully",
                data: { lessons }
            });
        }
        catch (error) {
            next(error);
        }
    }
};

export default LessonController;
