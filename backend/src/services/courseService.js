
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js'
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
    async setPublishStatus(courseId, status) {
        const course = await Course.findById(courseId);
        if (!course) throw new AppError("Course not found", 404);
        console.log('==> Status FE gửi lên:', status);
        if(status === "publish"){
            course.isPublished = true;
        } else if(status === "unpublish"){
            course.isPublished = false;
        }
         console.log('==> isPublished sau sửa:', course.isPublished);
        await course.save();

        return Course.findById(courseId)
            .populate("teacherId", "username email avatar")
            .lean();
    },
    async getCourseDashboard(user) {
        const query = {};

        // teacher chỉ xem course của họ
        if (user.role.toLowerCase() === "teacher") {
            query.teacherId = user.userId;
        }

        const [
            totalCourses,
            publishedCourses,
            draftCourses,

            latestCourses,
            topCourses,

            courseStats,

            totalEnrollments,
            completedEnrollments,

            averageProgress,

            enrollmentGrowth
        ] = await Promise.all([
            // ===== COURSE COUNTS =====
            Course.countDocuments(query),

            Course.countDocuments({ ...query, isPublished: true }),

            Course.countDocuments({ ...query, isPublished: false }),

            // ===== LATEST COURSES =====
            Course.find(query)
                .select("title thumbnail level studentsCount createdAt isPublished")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // ===== TOP COURSES =====
            Course.find(query)
                .select("title thumbnail level studentsCount totalLessons")
                .sort({ studentsCount: -1 })
                .limit(5)
                .lean(),

            // ===== COURSE STATS =====
            Course.aggregate([
                { $match: query },

                {
                    $group: {
                        _id: null,

                        totalStudents: { $sum: "$studentsCount" },

                        totalLessons: { $sum: "$totalLessons" },

                        totalDuration: { $sum: "$totalDuration" }
                    }
                }
            ]),

            // ===== ENROLLMENTS =====
            Enrollment.countDocuments({ status: "active" }),

            Enrollment.countDocuments({
                status: "active",
                progressPercent: 100
            }),

            // ===== AVERAGE PROGRESS =====
            Enrollment.aggregate([
                { $match: { status: "active" } },

                {
                    $group: {
                        _id: null,
                        averageProgress: { $avg: "$progressPercent" }
                    }
                }
            ]),

            // ===== ENROLLMENT GROWTH =====
            Enrollment.aggregate([
                { $match: { status: "active" } },

                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },

                        totalEnrollments: { $sum: 1 }
                    }
                },

                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ])
        ]);

        const stats = courseStats[0] || {
            totalStudents: 0,
            totalLessons: 0,
            totalDuration: 0
        };

        const avgProgress = Math.round(
            averageProgress[0]?.averageProgress || 0
        );

        const completionRate = totalEnrollments > 0
            ? Math.round(
                (completedEnrollments / totalEnrollments) * 100
            )
            : 0;

        return {
            overview: {
                totalCourses,
                publishedCourses,
                draftCourses,

                totalStudents: stats.totalStudents,

                totalLessons: stats.totalLessons,

                totalDuration: stats.totalDuration
            },

            learningStats: {
                totalEnrollments,
                completedEnrollments,

                averageProgress: avgProgress,

                completionRate
            },

            charts: {
                enrollmentGrowth
            },

            topCourses,

            latestCourses
        };
    }
}

export default courseService;