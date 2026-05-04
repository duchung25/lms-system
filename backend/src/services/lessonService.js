import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";
import enrollmentService from "./enrollmentService.js";

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
            query.isPublished = true;
        }
        const course = await Course.findOneWithDeleted(query).lean();
        if(!course){
            throw new AppError("Course not found", 404);
        }
        const lessonQuery = { courseId };
        if(user?.role === "student"){
            lessonQuery.isPublished = true;
        }
        const lessons = await Lesson.find(lessonQuery)
        .select("_id title order duration ")
        .sort({ order: 1 })
        .lean();

        if(user?.role !== "student"){
            return lessons;
        }

        const enrollment = await Enrollment.findOne({
            courseId,
            studentId: user.userId,
            status: "active"
        }).lean();
        if(!enrollment){
            return lessons.map((lesson, index) => ({
                ...lesson,
                isCompleted: false,
                isLocked: index !== 0
            }));
        }

        const completedIds = new Set((enrollment.completedLessonIds || []).map(id => id.toString()));
        return lessons.map((lesson, index) => {
            const previousLesson = lessons[index - 1];
            const isCompleted = completedIds.has(lesson._id.toString());
            const canAccess = index === 0 || isCompleted || completedIds.has(previousLesson?._id.toString());
            return {
                ...lesson,
                isCompleted,
                isCurrent: enrollment.currentLessonId?.toString() === lesson._id.toString(),
                isLocked: !canAccess
            };
        });
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
        if(user?.role === "student" && !course.isPublished){
            throw new AppError("Course is not published yet", 403);
        }
        if(user?.role === "student"){
            const canAccess = await enrollmentService.canAccessLesson(courseId, user.userId, lessonId);
            if(!canAccess){
                throw new AppError("Please complete the previous lesson before opening this lesson", 403);
            }
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
