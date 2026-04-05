import { get } from 'mongoose';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';

const courseService = {
    async createCourse(courseData) {
        const {title, description, category, level, price, teacherId} = courseData;
        const course = await Course.create(courseData);
        return await course.populate("teacherId", "username email avatar");
    },
    async getAllCourse(){
        return await Course.find()
        .populate("teacherId", "username email avatar")
        .lean();
    },
    async getPublishedCourses(){
        return await Course.find({ isPublished: true })
        .populate("teacherId", "username email avatar")
        .lean();
    },
    async getCourseById(courseId){
        const course = await Course.findById(courseId)
        .populate("teacherId", "username email avatar");
        if(!course){
            throw new AppError("Course not found", 404);
        }
        return course;
    },
    async updateCourse(courseId, updateData, currentUser){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        Object.assign(course, updateData);
        return await course.save().populate("teacherId", "username email avatar");
    },
    async deleteCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course) {
            throw new AppError("Course not found", 404);
        }
        await course.delete({ _id: courseId });
        return {
            message: "Course deleted successfully",
            deletedCourseId: courseId
        }
    },
    async restoreCourse(courseId){
        const course = await Course.findWithDeleted({ _id: courseId });
        if(!course || course.length === 0){
            throw new AppError("Course not found", 404);
        }
        await Course.restore({ _id: courseId });
        return {
            message: "Course restored successfully",
            restoredCourseId: courseId
        }
    },
    async getCourseByTeacherId(teacherId){
        return await Course.find({ teacherId })
        .populate("teacherId", "username email avatar")
        .lean();
    },
    async publishCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        course.isPublished = true;
        await course.save();
    },
    async unpublishCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        course.isPublished = false;
        await course.save();
    }
}

export default courseService;