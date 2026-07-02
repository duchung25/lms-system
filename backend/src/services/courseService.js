
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js'
import AppError from '../utils/AppError.js';
import ratingService from './ratingService.js';
import lessonProgressService from './lessonProgressService.js';
import notificationService from './notificationService.js';


const courseService = {
    async createCourse(courseData) {
        const course = await Course.create(courseData);
        return await course.populate("teacherId", "username email avatar");
    },
    async getAllCourse(options = {}) {
        const {
            q, categoryId, status, published, level, deleted,
            page = 1,
            limit = 10,
            sort
        } = options;

        const filter = {};

        if (q) filter.title = { $regex: q, $options: 'i' };
        if (categoryId) filter.categoryId = categoryId;
        if (level) filter.level = level;

        if (status) filter.status = status;
        else if (published === 'true' || published === true) filter.status = 'PUBLISHED';
        else if (published === 'false' || published === false) filter.status = { $ne: 'PUBLISHED' };

        if (deleted === 'true' || deleted === true) filter.deleted = true;
        else if (deleted === 'false' || deleted === false) filter.deleted = false;
        if (level) filter.level = level;

        const sortOpt = {};
        if (sort) {
            if (sort.startsWith('-')) sortOpt[sort.slice(1)] = -1;
            else sortOpt[sort] = 1;
        }

        const pendingFilter = { ...filter };
        delete pendingFilter.status;
        pendingFilter.status = 'PENDING_REVIEW';

        const skip = (page - 1) * limit;
        if(deleted === 'true'){
            const [list, total, pendingCount] = await Promise.all([
                Course.findWithDeleted(filter).populate("teacherId", "email").populate("categoryId", "name slug status").sort(sortOpt).skip(skip).limit(limit),
                Course.countDocumentsDeleted(filter),
                Course.countDocumentsDeleted(pendingFilter)
            ]);
            const totalPages = Math.ceil(total / limit);
            return { list, page, limit, total, totalPages, pendingCount};
        }
        const [list, total, pendingCount] = await Promise.all([
            Course.find(filter).populate("teacherId", "email").populate("categoryId", "name slug status").sort(sortOpt).skip(skip).limit(limit),
            Course.countDocuments(filter),
            Course.countDocuments(pendingFilter)
        ]);
        const totalPages = Math.ceil(total / limit);

        return { list, page, limit, total, totalPages, pendingCount };
    },
    async getCourseDetail(courseId, user){
        const query = { _id: courseId };
        if(user?.role === "student"){
            query.status = "PUBLISHED";
        }
        const course = await Course.findOneWithDeleted(query)
            .populate("teacherId", "username email avatar")
            .populate("categoryId", "name slug")
            .lean();
        if(!course){
            throw new AppError("Course not found", 404);
        }
        if (user?.role === "student") {
            course.myRating = await ratingService.getMyRating(courseId, user.userId);
            try {
                course.progress = await lessonProgressService.getCourseProgress(courseId, user.userId);
            } catch (error) {
                course.progress = null;
            }
        } else {
            course.myRating = null;
            course.progress = null;
        }
        return course ;
    },
    async updateCourse(courseId, updateData) {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", 404);
        }
        const allowedFields = ["title", "description", "categoryId", "level", "price", "thumbnail"];
        for (const key of allowedFields) {
            if (key in updateData) {
                course[key] = updateData[key];
            }
        }
        await course.save();
        await course.populate("teacherId", "username email avatar");
        await course.populate("categoryId", "name slug");
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
        .populate("categoryId", "name slug")
        .lean();
    },
    async setPublishStatus(courseId, status) {
        const course = await Course.findById(courseId);
        if (!course) throw new AppError("Course not found", 404);
        const wasPublished = course.status === "PUBLISHED";
        
        if(status === "publish") course.status = "PUBLISHED";
        else if(status === "unpublish") course.status = "DRAFT";
        
        await course.save();
        if (status === "publish" && !wasPublished) {
            await notificationService.createNotification({
                userId: course.teacherId,
                title: "Khóa học đã được xuất bản",
                message: `Khóa học ${course.title} đã được xuất bản.`,
                type: "COURSE_PUBLISHED",
                referenceId: course._id,
                referenceType: "Course",
                link: `/courses/${course._id}`,
            });
        }
        return Course.findById(courseId)
            .populate("teacherId", "username email avatar")
            .populate("categoryId", "name slug")
            .lean();
    },
    async submitCourseForReview(courseId) {
        const course = await Course.findById(courseId);
        if (!course) throw new AppError("Course not found", 404);
        
        if (course.status !== 'DRAFT' && course.status !== 'REJECTED') {
            throw new AppError("Only Draft or Rejected courses can be submitted", 400);
        }
        
        course.status = 'PENDING_REVIEW';
        course.submittedAt = new Date();
        course.rejectionReason = '';
        await course.save();
        return Course.findById(courseId)
            .populate("teacherId", "username email avatar")
            .populate("categoryId", "name slug")
            .lean();
    },
    async reviewCourse(courseId, { status, rejectionReason, adminId }) {
        const course = await Course.findById(courseId);
        if (!course) throw new AppError("Course not found", 404);
        
        if (course.status !== 'PENDING_REVIEW') {
            throw new AppError("Only courses pending review can be reviewed", 400);
        }
        
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            throw new AppError("Invalid review status. Must be APPROVED or REJECTED", 400);
        }

        if (status === 'REJECTED' && !rejectionReason?.trim()) {
            throw new AppError("Rejection reason is required", 400);
        }

        course.reviewedBy = adminId;
        course.reviewedAt = new Date();
        
        if (status === 'APPROVED') {
            course.status = 'PUBLISHED';
            course.rejectionReason = '';
        } else {
            course.status = 'REJECTED';
            course.rejectionReason = rejectionReason.trim();
        }
        
        await course.save();
        await notificationService.createNotification({
            userId: course.teacherId,
            title: status === 'APPROVED' ? "Khóa học đã được duyệt" : "Khóa học bị từ chối",
            message: status === 'APPROVED'
                ? `Khóa học ${course.title} đã được duyệt.`
                : `Khóa học ${course.title} bị từ chối: ${course.rejectionReason}`,
            type: status === 'APPROVED' ? "COURSE_APPROVED" : "COURSE_REJECTED",
            referenceId: course._id,
            referenceType: "Course",
            link: `/courses/${course._id}`,
        });
        return Course.findById(courseId)
            .populate("teacherId", "username email avatar")
            .populate("categoryId", "name slug")
            .populate("reviewedBy", "username email avatar")
            .lean();
    },
    async getAdminCourseDashboard() {
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
            Course.countDocuments(),

            Course.countDocuments({ status: "PUBLISHED" }),

            Course.countDocuments({ status: { $in: ["DRAFT", "PENDING_REVIEW", "REJECTED"] } }),

            Course.find()
                .select("title thumbnail level studentsCount createdAt status")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Course.find()
                .select("title thumbnail level studentsCount totalLessons")
                .sort({ studentsCount: -1 })
                .limit(5)
                .lean(),

            Course.aggregate([
                {
                    $group: {
                        _id: null,
                        totalStudents: { $sum: "$studentsCount" },
                        totalLessons: { $sum: "$totalLessons" },
                        totalDuration: { $sum: "$totalDuration" }
                    }
                }
            ]),

            Enrollment.countDocuments({ status: "active" }),

            Enrollment.countDocuments({
                status: "active",
                progressPercent: 100
            }),

            Enrollment.aggregate([
                {
                    $match: { status: "active" }
                },
                {
                    $group: {
                        _id: null,
                        averageProgress: { $avg: "$progressPercent" }
                    }
                }
            ]),

            Enrollment.aggregate([
                {
                    $match: { status: "active" }
                },
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

        const stats = courseStats[0] ?? {
            totalStudents: 0,
            totalLessons: 0,
            totalDuration: 0
        };

        const avgProgress = Math.round(
            averageProgress[0]?.averageProgress ?? 0
        );

        const completionRate = totalEnrollments
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
    },
    async getTeacherCourseDashboard(teacherId) {
        const query = { teacherId };

        const teacherCourses = await Course.find(query)
            .select("_id")
            .lean();

        const courseIds = teacherCourses.map(course => course._id);

        const enrollmentQuery = {
            status: "active",
            courseId: { $in: courseIds }
        };

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
            Course.countDocuments(query),

            Course.countDocuments({
                ...query,
                status: "PUBLISHED"
            }),

            Course.countDocuments({
                ...query,
                status: { $in: ["DRAFT", "PENDING_REVIEW", "REJECTED"] }
            }),

            Course.find(query)
                .select("title thumbnail level studentsCount createdAt status")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Course.find(query)
                .select("title thumbnail level studentsCount totalLessons")
                .sort({ studentsCount: -1 })
                .limit(5)
                .lean(),

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

            Enrollment.countDocuments(enrollmentQuery),

            Enrollment.countDocuments({
                ...enrollmentQuery,
                progressPercent: 100
            }),

            Enrollment.aggregate([
                { $match: enrollmentQuery },
                {
                    $group: {
                        _id: null,
                        averageProgress: {
                            $avg: "$progressPercent"
                        }
                    }
                }
            ]),

            Enrollment.aggregate([
                { $match: enrollmentQuery },
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

        const stats = courseStats[0] ?? {
            totalStudents: 0,
            totalLessons: 0,
            totalDuration: 0
        };

        const avgProgress = Math.round(
            averageProgress[0]?.averageProgress ?? 0
        );

        const completionRate = totalEnrollments
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
    },
    async getTopSellingCourses(limit = 4) {
        return await Course.find({ status: 'PUBLISHED', deleted: false })
            .populate("teacherId", "email name avatar") 
            .populate("categoryId", "name slug")
            .select("title thumbnail price rating reviews level slug") 
            .sort({ sales: -1 }) 
            .limit(limit);
    },

    async getLatestCourses(limit = 5) {
        return await Course.find({ status: 'PUBLISHED', deleted: false })
            .populate("teacherId", "email name avatar")
            .populate("categoryId", "name slug")
            .select("title thumbnail price rating reviews level slug createdAt")
            .sort({ createdAt: -1 }) 
            .limit(limit);
    }
}

export default courseService;
