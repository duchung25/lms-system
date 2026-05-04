
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import AppError from '../utils/AppError.js';


const courseService = {
    async createCourse(courseData) {
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
        if (level) filter.level = level;

        if (published === 'true' || published === true) filter.isPublished = true;
        else if (published === 'false' || published === false) filter.isPublished = false;

        if (deleted === 'true' || deleted === true) filter.deleted = true;
        else if (deleted === 'false' || deleted === false) filter.deleted = false;
        if (level) filter.level = level;

        const sortOpt = {};
        if (sort) {
            if (sort.startsWith('-')) sortOpt[sort.slice(1)] = -1;
            else sortOpt[sort] = 1;
        }

        const pendingFilter = { ...filter };
        delete pendingFilter.isPublished;
        pendingFilter.isPublished = false;

        const skip = (page - 1) * limit;
        if(deleted === 'true'){
            const [list, total, pendingCount] = await Promise.all([
                Course.findWithDeleted(filter).populate("teacherId", "email").sort(sortOpt).skip(skip).limit(limit),
                Course.countDocumentsDeleted(filter),
                Course.countDocumentsDeleted(pendingFilter)
            ]);
            const totalPages = Math.ceil(total / limit);
            return { list, page, limit, total, totalPages, pendingCount};
        }
        const [list, total, pendingCount] = await Promise.all([
            Course.find(filter).populate("teacherId", "email").sort(sortOpt).skip(skip).limit(limit),
            Course.countDocuments(filter),
            Course.countDocuments(pendingFilter)
        ]);
        const totalPages = Math.ceil(total / limit);

        return { list, page, limit, total, totalPages, pendingCount };
    },
    async getCourseDetail(courseId, user){
        const query = { _id: courseId };
        if(user?.role === "student"){
            query.isPublished = true;
        }
        const course = await Course.findOneWithDeleted(query)
            .populate("teacherId", "username email avatar")
            .lean();
        if(!course){
            throw new AppError("Course not found", 404);
        }
        return course ;
    },
    async updateCourse(courseId, updateData) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const allowedFields = ["title", "description", "category", "level", "price", "thumbnail"];
        for (const key of allowedFields) {
            if (key in updateData) {
                course[key] = updateData[key];
            }
        }
        await course.save();
        await course.populate("teacherId", "username email avatar");
        return course;
    },
    async deleteCourse(courseId){
        const course = await Course.findById(courseId);
        if(!course)  throw new AppError("Course not found", 404);
        
        await Promise.all([
            Course.delete({ _id: courseId }),
            Lesson.delete({ courseId })
        ]);
        return { message: "Course deleted successfully" };
    },
    async restoreCourse(courseId){
        const course = await Course.findWithDeleted({ _id: courseId });
        if(!course || course.length === 0){
            throw new AppError("Course not found", 404);
        }
        await Promise.all([
            Course.restore({ _id: courseId }),
            Lesson.restore({ courseId })
        ]);
        return { message: "Course restored successfully" };
    },
    async getCourseByTeacherId(teacherId){
        return await Course.find({ teacherId })
        .populate("teacherId", "username email avatar")
        .lean();
    },
    async setPublishStatus(courseId, isPublished) {
        const course = await Course.findById(courseId);
        if (!course) throw new AppError("Course not found", 404);

        course.isPublished = isPublished;
        await course.save();

        return Course.findById(courseId)
            .populate("teacherId", "username email avatar")
            .lean();
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