
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import AppError from '../utils/AppError.js';


const courseService = {
    async createCourse(courseData) {
        const {title, description, category, level, price, teacherId} = courseData;
        const course = await Course.create(courseData);
        return await course.populate("teacherId", "username email avatar");
    },
    async getAllCourse(options = {}) {
        const {
            q, category, published, level, deleted,
            page = 1,
            limit = 10,
            sort
        } = options;

        const filter = {};
        if (q) filter.title = { $regex: q, $options: 'i' };
        if (category) filter.category = category;
        if (typeof published !== 'undefined') filter.isPublished = published;
        if (typeof deleted !== 'undefined'){
            filter.deleted = deleted === 'true';
        }
        if (level) filter.level = level;

        const sortOpt = {};
        if (sort) {
            if (sort.startsWith('-')) sortOpt[sort.slice(1)] = -1;
            else sortOpt[sort] = 1;
        }

        const skip = (page - 1) * limit;
        if(deleted === 'true'){
            const [list, total] = await Promise.all([
                Course.findWithDeleted(filter).populate("teacherId", "email").sort(sortOpt).skip(skip).limit(limit),
                Course.countDocumentsDeleted(filter)
            ]);
            const totalPages = Math.ceil(total / limit);
            return { list, page, limit, total, totalPages };

        }
        const [list, total] = await Promise.all([
            Course.find(filter).populate("teacherId", "email").sort(sortOpt).skip(skip).limit(limit),
            Course.countDocuments(filter)
        ]);
        const totalPages = Math.ceil(total / limit);

        return { list, page, limit, total, totalPages };
    },
    async getCourseDetail(courseId){
        const [course, lessons] = await Promise.all([
            Course.findOneWithDeleted({ _id: courseId })
            .populate("teacherId", "username email avatar")
            .lean(),

            Lesson.find({ courseId })
            .select("title order duration")
            .sort({ order: 1 })
            .lean()
        ]);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        return { ...course, lessons };
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
        const updatedCourse = await Course.findById(courseId).populate("teacherId", "username email avatar").lean();
        return updatedCourse;
    },
    async unpublishCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course){
            throw new AppError("Course not found", 404);
        }
        course.isPublished = false;
        await course.save();
        const updatedCourse = await Course.findById(courseId).populate("teacherId", "username email avatar").lean();
        return updatedCourse;
    },
    async countHandler(){
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const unpublishedCourses = await Course.countDocuments({ isPublished: false });
        return {
            totalCourses,
            publishedCourses,
            unpublishedCourses
        };
    }
}

export default courseService;