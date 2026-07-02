import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";
import enrollmentService from "./enrollmentService.js";
import lessonProgressService from "./lessonProgressService.js";
import notificationService from "./notificationService.js";

const LessonService = {
    async createLesson(courseid, data, user ){
        const course = await Course.findById(courseid);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        const lastLesson = await Lesson.findOne({ courseId: courseid }).sort({ order: -1 });
        const nextorder = lastLesson ? lastLesson.order + 1 : 1;

        const lesson = await Lesson.create({ ...data, courseId: courseid, order: nextorder, createdBy: user.userId });
        await Course.findByIdAndUpdate(courseid, { 
            $inc: { 
                totalLessons: 1,
                totalDuration: data.duration || 0 
            } 
        });
        return lesson;
    },
    async getLessonsByCourse(courseId, user){
        const query = { _id: courseId };
        if(user?.role === "student"){
            query.status = "PUBLISHED";
        }
        const course = await Course.findOneWithDeleted(query).lean();
        if(!course){
            throw new AppError("Course not found", 404);
        }
        const lessons = await Lesson.find({ courseId, isPublished: true })
        .select("_id title order duration ")
        .sort({ order: 1 })
        .lean();
        if(!user){
            return lessons;
        }
        if(user?.role !== "student"){
            return lessons;
        }

        return lessonProgressService.getLessonStates(courseId, user.userId);
    },
    async getFirstLesson(courseId) {
        return Lesson.findOne({ courseId, isPublished: true }).sort({ order: 1 }).select("_id").lean();
    },
    async getPublishedLessons(courseId) {
        return Lesson.find({ courseId, isPublished: true }).sort({ order: 1 }).select("_id order").lean();
    },
    async getPublishedLessonsByCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        if(course.status !== "PUBLISHED"){
            throw new AppError("Course is not published yet", 400);
        }
        return await Lesson.find({ courseId, isPublished: true })
        .select(" title order duration ")
        .sort({ order: 1 })
        .lean();
    },
    async getLessonDetail(courseId, lessonId, user){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        const lesson = await Lesson.findById(lessonId).select("title videoUrl createdAt courseId isPublished").lean();
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        if(!lesson.courseId.equals(courseId)){
            throw new AppError("Lesson does not belong to the specified course", 400);
        }
        if(user?.role === "student" && course.status !== "PUBLISHED"){
            throw new AppError("Course is not published yet", 403);
        }
        if(user?.role === "student"){
            await lessonProgressService.canAccessLesson(courseId, user.userId, lessonId);
        }
        return lesson;
    },
    async updateLesson(lessonId, data, user){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        const allowed = ["title", "content", "videoUrl", "duration"];
        for(const key of Object.keys(data)){
            if(allowed.includes(key)){
                lesson[key] = data[key];
            }
        }

        const oldDuration = lesson.duration || 0;
        const newDuration = data.duration ?? oldDuration;
        const delta = newDuration - oldDuration;

        await lesson.save();
        if(delta !== 0){
            await Course.findByIdAndUpdate(lesson.courseId, { 
                $inc: { totalDuration: delta } 
            });
        }
        return lesson;
    },
    async deleteLesson(lessonId, user){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        await Promise.all([
            Lesson.delete({ _id: lessonId }),
            Course.findByIdAndUpdate(lesson.courseId, { 
                $inc: {
                    totalLessons: -1,
                    totalDuration: -(lesson.duration || 0)
                }
            }),
            Lesson.updateMany(
                { 
                    courseId: lesson.courseId, 
                    order: { $gt: lesson.order } 
                }, 
                    { $inc: { order: -1 } })
        ]);
        return {
            message: "Lesson deleted successfully"
        }
    },
    async restoreLesson(lessonId, user){
        const lesson = await Lesson.findOneWithDeleted({ _id: lessonId });
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        await Promise.all([
            Lesson.restore({ _id: lessonId }),
            Course.findByIdAndUpdate(lesson.courseId, { 
                $inc: {
                    totalLessons: 1,
                    totalDuration: lesson.duration || 0
                }
            }),
            Lesson.updateMany(
                { 
                    courseId: lesson.courseId,
                    order: { $gte: lesson.order } 
                }, 
                    { $inc: { order: 1 } })
        ]);
        return {
            message: "Lesson restored successfully"
        }
    },
    async publishLesson(lessonId){
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }
        const wasPublished = lesson.isPublished;
        lesson.isPublished = true;
        const savedLesson = await lesson.save();

        if (!wasPublished) {
            const [course, enrollments] = await Promise.all([
                Course.findById(lesson.courseId).select("title").lean(),
                Enrollment.find({ courseId: lesson.courseId, status: "active" })
                    .select("studentId")
                    .lean(),
            ]);

            await notificationService.createManyNotifications(
                enrollments.map((enrollment) => ({
                    userId: enrollment.studentId,
                    title: "Bài học mới đã được xuất bản",
                    message: `Bài học ${lesson.title} trong khóa ${course?.title || ""} đã sẵn sàng.`.trim(),
                    type: "NEW_LESSON_PUBLISHED",
                    referenceId: lesson._id,
                    referenceType: "Lesson",
                    link: `/courses/${lesson.courseId}/lessons/${lesson._id}`,
                }))
            );
        }

        return savedLesson;
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
