import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const LessonService = {
    async createLesson(courseid, data, user ){
        const course = await Course.findById(courseid);
        if(!course){
            throw new Error("Course not found");
        }
        const isOwner = course.teacherId.toString() === user.userId;
        const isAdmin = user.role === "admin";
        if(!isOwner && !isAdmin){
            throw new Error("You are not the owner of this course");
        }
        const lastLesson = await Lesson.findOne({ courseId: courseid }).sort({ order: -1 });
        const nextorder = lastLesson ? lastLesson.order + 1 : 1;
        const lesson = await Lesson.create({ ...data, courseId: courseid, order: nextorder, createdBy: user.userId });
        return lesson;
    },
    async getLessonsByCourse(courseId, user){
        const course = await Course.findById(courseId);
        if(!course){
            throw new Error("Course not found");
        }
        if(!course.isPublished){
            throw new Error("Course is not published yet");
        }
        return await Lesson.find({ courseId })
        .select(" title order duration ")
        .sort({ order: 1 })
        .lean();
    },
    async getLessonById(id, user){
        const lesson = await Lesson.findById(id);
        if(!lesson){
            throw new Error("Lesson not found");
        }
        const course = await Course.findById(lesson.courseId);
        if(!course.isPublished){
            throw new Error("Course is not published yet");
        }
        return lesson;
    },
    async updateLesson(id, data, user){
        const lesson = await Lesson.findById(id);
        if(!lesson){
            throw new Error("Lesson not found");
        }
        const course = await Course.findById(lesson.courseId);
        const isOwner = course.teacherId.toString() === user.userId;
        const isAdmin = user.role === "admin";
        if(!isOwner && !isAdmin){
            throw new Error("You are not the owner of this course");
        }
        delete data.order;
        Object.assign(lesson, data);
        return await lesson.save();
    },
    async deleteLesson(id, user){
        const lesson = await Lesson.findById(id);
        if(!lesson){
            throw new Error("Lesson not found");
        }
        const course = await Course.findById(lesson.courseId);
        const isOwner = course.teacherId.toString() === user.userId;
        const isAdmin = user.role === "admin";
        if(!isOwner && !isAdmin){
            throw new Error("You are not the owner of this course");
        }
        await Lesson.delete({ _id: id });
        return {
            message: "Lesson deleted successfully",
            deletedLessonId: id
        }
    },
    async restoreLesson(id, user){
        const lesson = await Lesson.findById(id);
        if(!lesson){
            throw new Error("Lesson not found");
        }
        const course = await Course.findById(lesson.courseId);
        const isOwner = course.teacherId.toString() === user.userId;
        const isAdmin = user.role === "admin";
        if(!isOwner && !isAdmin){
            throw new Error("You are not the owner of this course");
        }
        await Lesson.restore({ _id: id });
        return {
            message: "Lesson restored successfully",
            restoredLessonId: id
        }
    }
};

export default LessonService;