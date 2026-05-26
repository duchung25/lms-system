import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import LessonService from "./lessonService.js";
import AppError from "../utils/AppError.js";

const getLessonProgressState = (lessons, completedLessonIds, lessonId) => {
    const completedIds = new Set(completedLessonIds.map(id => id.toString()));
    const lessonIndex = lessons.findIndex(lesson => lesson._id.toString() === lessonId.toString());
    if(lessonIndex === -1){
        return { lessonIndex, canAccess: false, isCompleted: false, nextLessonId: null };
    }

    const lesson = lessons[lessonIndex];
    const previousLesson = lessons[lessonIndex - 1];
    const isCompleted = completedIds.has(lesson._id.toString());
    const canAccess = lessonIndex === 0 || isCompleted || completedIds.has(previousLesson?._id.toString());
    const nextLessonId = lessons[lessonIndex + 1]?._id || null;

    return { lessonIndex, canAccess, isCompleted, nextLessonId };
};

const enrollmentService = {
    async enrollInCourse(courseId, studentId) {
        const course = await Course.findById(courseId);
        if (!course?.isPublished) {
            throw new AppError("Course not found", 404);
        }

        const firstLessonId = (await LessonService.getFirstLesson(courseId))?._id || null;
        let enrollment = await Enrollment.findOne({ courseId, studentId });
        if (enrollment) {
            if (enrollment.status === "active") {
                throw new AppError("Already enrolled in this course", 400);
            }
            enrollment.status = "active";
            enrollment.cancelledAt = null;
            enrollment.currentLessonId ||= firstLessonId;
            await enrollment.save();
            await Course.findByIdAndUpdate(courseId, {
                $inc: {
                    studentsCount: 1
                }
            });
        } 
        else {
            enrollment = await Enrollment.create({
                courseId,
                studentId,
                currentLessonId: firstLessonId,
                lastAccessedAt: firstLessonId ? new Date() : null
            });
            await Course.findByIdAndUpdate(courseId, {
                $inc: {
                    studentsCount: 1
                }
            });
        }
        return {
            enrollment,
            firstLessonId,
            currentLessonId: enrollment.currentLessonId
        };
    },
    async unenrollFromCourse(courseId, studentId){
        const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" });
        if(!enrollment){
            throw new AppError("Enrollment not found", 404);
        }
        enrollment.status = "cancelled";
        enrollment.cancelledAt = new Date();
        await enrollment.save();
        await Course.findByIdAndUpdate(courseId, {
            $inc: {
                studentsCount: -1
            }
        });
        return enrollment;
    },
    // async getMyEnrollments(studentId){
    //     const enrollments = await Enrollment.find({ studentId, status: "active" })
    //                                         .populate({
    //                                             path: "courseId",
    //                                             select: "title description teacherId thumbnail price level",
    //                                             populate: {
    //                                                 path: "teacherId",
    //                                                 select: "username email"
    //                                             }
    //                                         })
    //                                         .lean();
    //     const courseIds = enrollments.map(e => e.courseId?._id).filter(Boolean);
    //     const firstLessons = await Lesson.find({ courseId: { $in: courseIds }, isPublished: true })
    //                                     .sort({ order: 1 })
    //                                     .select("_id courseId")
    //                                     .lean();
    //     const firstLessonByCourse = new Map();
    //     const publishedLessonIds = new Set();
    //     firstLessons.forEach((lesson) => {
    //         publishedLessonIds.add(lesson._id.toString());
    //         const key = lesson.courseId.toString();
    //         if(!firstLessonByCourse.has(key)){
    //             firstLessonByCourse.set(key, lesson._id);
    //         }
    //     });

    //     return enrollments
    //         .filter(e => e.courseId)
    //         .map(e => {
    //             const courseKey = e.courseId._id.toString();
    //             const firstLessonId = firstLessonByCourse.get(courseKey) || null;
    //             const savedLessonId = e.currentLessonId?.toString();
    //             const currentLessonId = savedLessonId && publishedLessonIds.has(savedLessonId)
    //                 ? e.currentLessonId
    //                 : firstLessonId;
    //             return {
    //                 ...e.courseId,
    //                 enrollmentId: e._id,
    //                 currentLessonId,
    //                 firstLessonId,
    //                 progressPercent: e.progressPercent || 0,
    //                 completedLessonIds: e.completedLessonIds || [],
    //                 lastAccessedAt: e.lastAccessedAt
    //             };
    //         });
    // },
    async getMyEnrollments(studentId) {
        const enrollments = await Enrollment.find({
            studentId,
            status: "active"
        })
            .populate({
                path: "courseId",
                select: "title description teacherId thumbnail price level",
                populate: {
                    path: "teacherId",
                    select: "username email"
                }
            })
            .lean();

        return enrollments.map(e => ({
            _id: e.courseId?._id,
            title: e.courseId?.title,
            description: e.courseId?.description,
            thumbnail: e.courseId?.thumbnail,
            price: e.courseId?.price,
            level: e.courseId?.level,
            teacherId: e.courseId?.teacherId,
            enrollmentId: e._id,
            progressPercent: e.progressPercent || 0,
            lastAccessedAt: e.lastAccessedAt
        }));
    },
                                                
    async getCourseEnrollments(courseId){
        return Enrollment.find({ courseId, status: "active" }).populate("studentId", "username email avatar").lean();
    },
    async updateLearningProgress(courseId, studentId, lessonId){
        if(!lessonId){
            throw new AppError("lessonId is required", 400);
        }

        const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" });
        if(!enrollment){
            throw new AppError("Enrollment not found", 404);
        }

        const lesson = await Lesson.findOne({ _id: lessonId, courseId, isPublished: true }).select("_id").lean();
        if(!lesson){
            throw new AppError("Lesson not found", 404);
        }

        const lessons = await LessonService.getPublishedLessons(courseId);
        const progressState = getLessonProgressState(lessons, enrollment.completedLessonIds, lessonId);
        if(!progressState.canAccess){
            throw new AppError("Please complete the previous lesson before opening this lesson", 403);
        }

        enrollment.currentLessonId = lessonId;
        enrollment.lastAccessedAt = new Date();

        await enrollment.save();
        return enrollment;
    },
    async completeLesson(courseId, studentId, lessonId){
        if(!lessonId){
            throw new AppError("lessonId is required", 400);
        }

        const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" });
        if(!enrollment){
            throw new AppError("Enrollment not found", 404);
        }

        const lessons = await LessonService.getPublishedLessons(courseId);
        const progressState = getLessonProgressState(lessons, enrollment.completedLessonIds, lessonId);
        if(progressState.lessonIndex === -1){
            throw new AppError("Lesson not found", 404);
        }
        if(!progressState.canAccess){
            throw new AppError("Please complete the previous lesson before completing this lesson", 403);
        }

        const completedIds = enrollment.completedLessonIds.map(id => id.toString());
        if(!completedIds.includes(lessonId.toString())){
            enrollment.completedLessonIds.push(lessonId);
            completedIds.push(lessonId.toString());
        }

        const completedLessonIds = new Set(completedIds);
        const completedCount = lessons.filter(lesson => completedLessonIds.has(lesson._id.toString())).length;
        const totalLessons = lessons.length;
        const isCourseCompleted = totalLessons > 0 && completedCount >= totalLessons;

        enrollment.currentLessonId = progressState.nextLessonId || lessonId;
        enrollment.lastAccessedAt = new Date();
        enrollment.progressPercent = totalLessons > 0
            ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
            : 0;

        await enrollment.save();
        return {
            enrollment,
            nextLessonId: progressState.nextLessonId,
            isCourseCompleted
        };
    },
    async canAccessLesson(courseId, studentId, lessonId){
        const enrollment = await Enrollment.findOne({ courseId, studentId, status: "active" }).lean();
        if(!enrollment){
            throw new AppError("Enrollment not found", 404);
        }

        const lessons = await LessonService.getPublishedLessons(courseId);
        const progressState = getLessonProgressState(lessons, enrollment.completedLessonIds || [], lessonId);
        if(progressState.lessonIndex === -1){
            throw new AppError("Lesson not found", 404);
        }

        return progressState.canAccess;
    }
};

export default enrollmentService;
