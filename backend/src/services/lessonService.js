import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import AppError from "../utils/AppError.js";

const LessonService = {
    async createLesson(courseid, data, user ){
        const course = await Course.findById(courseid);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        const lastLesson = await Lesson.findOne({ courseId: courseid }).sort({ order: -1 });
        const nextorder = lastLesson ? lastLesson.order + 1 : 1;
        const lesson = await Lesson.create({ ...data, courseId: courseid, order: nextorder, createdBy: user.userId });
        return lesson;
    },
    async getLessonsByCourse(courseId, user){
        const query = { _id: courseId };
        if(user?.role === "student"){
            query.isPublished = true;
        }
        const course = await Course.findOne(query).lean();
        if(!course){
            throw new AppError("Course not found", 404);
        }
        return await Lesson.find({ courseId })
        .select("_id title order duration ")
        .sort({ order: 1 })
        .lean();
    },
    async getPublishedLessonsByCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        if(!course.isPublished){
            throw new AppError("Course is not published yet", 400);
        }
        return await Lesson.find({ courseId, isPublished: true })
        .select(" title order duration ")
        .sort({ order: 1 })
        .lean();
    },
    async getLessonDetail(courseId, lessonId){
        const lesson = await Lesson.findById(lessonId).select("title videoUrl createdAt courseId isPublished").lean();
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        if(!lesson.courseId.equals(courseId)){
            throw new AppError("Lesson does not belong to the specified course", 400);
        }
        const course = await Course.findById(lesson.courseId);
        if(!course.isPublished){
            throw new AppError("Course is not published yet", 400);
        }
        return lesson;
    },
    async updateLesson(lessonId, data, user){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        delete data.order;
        Object.assign(lesson, data);
        return await lesson.save();
    },
    async deleteLesson(lessonId, user){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        await Lesson.delete({ _id: lessonId });
        return {
            message: "Lesson deleted successfully",
            deletedLessonId: lessonId
        }
    },
    async restoreLesson(lessonId, user){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        await Lesson.restore({ _id: lessonId });
        return {
            message: "Lesson restored successfully",
            restoredLessonId: lessonId
        }
    },
    async publishLesson(lessonId){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        lesson.isPublished = true;
        return await lesson.save();
    },
    async unpublishLesson(lessonId){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        lesson.isPublished = false;
        return await lesson.save();
    }

};

export default LessonService;