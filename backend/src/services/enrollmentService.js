import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import LessonService from "./lessonService.js";
import AppError from "../utils/AppError.js";
import lessonProgressService from "./lessonProgressService.js";

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
        if (course.price > 0) {
            throw new AppError("This course is not free. Please purchase the course before enrolling.", 400);
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

        await lessonProgressService.canAccessLesson(courseId, studentId, lessonId);

        enrollment.currentLessonId = lessonId;
        enrollment.lastAccessedAt = new Date();

        await enrollment.save();
        return enrollment;
    },
    async completeLesson(courseId, studentId, lessonId){
        if(!lessonId){
            throw new AppError("lessonId is required", 400);
        }

        const result = await lessonProgressService.markLessonCompleted(courseId, studentId, lessonId);
        return {
            enrollment: await Enrollment.findOne({ courseId, studentId, status: "active" }).lean(),
            nextLessonId: result.nextLessonId,
            isCourseCompleted: result.isCourseCompleted
        };
    },
    async canAccessLesson(courseId, studentId, lessonId){
        return lessonProgressService.canAccessLesson(courseId, studentId, lessonId);
    },
    async getStudentDashboard(studentId) {
        const [
            activeCourses,
            completedCourses,
            averageProgress,
            continueLearning,
            recentCourses,
            progressDistribution
        ] = await Promise.all([
            Enrollment.countDocuments({
                studentId,
                status: "active"
            }),

            Enrollment.countDocuments({
                studentId,
                status: "active",
                progressPercent: 100
            }),

            Enrollment.aggregate([
                {
                    $match: {
                        studentId,
                        status: "active"
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageProgress: {
                            $avg: "$progressPercent"
                        }
                    }
                }
            ]),

            Enrollment.find({
                studentId,
                status: "active",
                progressPercent: { $lt: 100 }
            })
                .populate(
                    "courseId",
                    "title thumbnail level"
                )
                .populate(
                    "currentLessonId",
                    "title order"
                )
                .sort({ lastAccessedAt: -1 })
                .limit(5)
                .lean(),

            Enrollment.find({
                studentId,
                status: "active"
            })
                .populate(
                    "courseId",
                    "title thumbnail level"
                )
                .sort({ lastAccessedAt: -1 })
                .limit(5)
                .lean(),

            Enrollment.aggregate([
                {
                    $match: {
                        studentId,
                        status: "active"
                    }
                },
                {
                    $bucket: {
                        groupBy: "$progressPercent",
                        boundaries: [0, 25, 50, 75, 100, 101],
                        default: "other",
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                }
            ])
        ]);

        const avgProgress = Math.round(
            averageProgress[0]?.averageProgress ?? 0
        );

        return {
            overview: {
                activeCourses,
                completedCourses,
                averageProgress: avgProgress
            },

            continueLearning,

            recentCourses,

            charts: {
                progressDistribution
            }
        };
    }
};

export default enrollmentService;
