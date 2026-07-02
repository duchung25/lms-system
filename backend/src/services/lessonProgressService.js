import LessonProgress from "../models/LessonProgress.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

const getPublishedLessons = async (courseId) => {
  return Lesson.find({ courseId, isPublished: true })
    .select("_id title order duration createdAt")
    .sort({ order: 1 })
    .lean();
};

const getAccessContext = async (courseId, studentId) => {
  const course = await Course.findOneWithDeleted({
    _id: courseId,
    status: "PUBLISHED",
  }).lean();

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const enrollment = await Enrollment.findOne({
    courseId,
    studentId,
    status: "active",
  }).lean();

  const paidOrder = enrollment
    ? null
    : await Order.findOne({
        courseId,
        studentId,
        status: "paid",
      }).lean();

  if (!enrollment && !paidOrder) {
    throw new AppError("Access denied: you are not enrolled in this course", 403);
  }

  return { course, enrollment, paidOrder };
};

const getCompletedLessonIds = async (courseId, studentId) => {
  const progress = await LessonProgress.find({ courseId, studentId })
    .select("lessonId completedAt")
    .sort({ completedAt: 1 })
    .lean();

  return progress;
};

const buildLessonStates = (lessons, completedLessonIds, lockAll = false) => {
  const completedSet = new Set(completedLessonIds.map((id) => id.toString()));

  return lessons.map((lesson, index) => {
    const isCompleted = completedSet.has(lesson._id.toString());
    const previousLesson = lessons[index - 1];
    const isLocked = lockAll
      ? true
      : index > 0 && !completedSet.has(previousLesson?._id?.toString());

    return {
      ...lesson,
      isCompleted,
      isLocked,
    };
  });
};

const syncEnrollmentProgress = async (courseId, studentId) => {
  const [lessons, progressDocs] = await Promise.all([
    getPublishedLessons(courseId),
    getCompletedLessonIds(courseId, studentId),
  ]);

  const completedLessonIds = progressDocs.map((doc) => doc.lessonId);
  const completedSet = new Set(completedLessonIds.map((id) => id.toString()));
  const completedCount = progressDocs.length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0
    ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
    : 0;

  const nextLesson = lessons.find((lesson) => !completedSet.has(lesson._id.toString())) || null;
  const isCourseCompleted = totalLessons > 0 && completedCount >= totalLessons;

  await Enrollment.findOneAndUpdate(
    { courseId, studentId, status: "active" },
    {
      $set: {
        progressPercent,
        currentLessonId: nextLesson?._id || lessons[lessons.length - 1]?._id || null,
        lastAccessedAt: new Date(),
      },
      $addToSet: {
        completedLessonIds: { $each: completedLessonIds },
      },
    },
    { new: true }
  );

  return {
    totalLessons,
    completedCount,
    progressPercent,
    isCourseCompleted,
    nextLessonId: nextLesson?._id || null,
  };
};

const lessonProgressService = {
  async canAccessLesson(courseId, studentId, lessonId) {
    await getAccessContext(courseId, studentId);

    const lessons = await getPublishedLessons(courseId);
    const progressDocs = await getCompletedLessonIds(courseId, studentId);
    const completedSet = new Set(progressDocs.map((doc) => doc.lessonId.toString()));
    const lessonIndex = lessons.findIndex((lesson) => lesson._id.toString() === lessonId.toString());

    if (lessonIndex === -1) {
      throw new AppError("Lesson not found", 404);
    }

    const isCompleted = completedSet.has(lessonId.toString());
    const previousLesson = lessons[lessonIndex - 1];
    const canAccess = lessonIndex === 0 || isCompleted || completedSet.has(previousLesson?._id?.toString());

    if (!canAccess) {
      throw new AppError("Please complete the previous lesson before opening this lesson", 403);
    }

    return true;
  },

  async getUnlockedLessons(courseId, studentId) {
    await getAccessContext(courseId, studentId);

    const lessons = await getPublishedLessons(courseId);
    const progressDocs = await getCompletedLessonIds(courseId, studentId);
    const states = buildLessonStates(
      lessons,
      progressDocs.map((doc) => doc.lessonId),
      false
    );

    return states;
  },

  async getCourseProgress(courseId, studentId) {
    await getAccessContext(courseId, studentId);

    const lessons = await getPublishedLessons(courseId);
    const progressDocs = await getCompletedLessonIds(courseId, studentId);
    const completedSet = new Set(progressDocs.map((doc) => doc.lessonId.toString()));
    const totalLessons = lessons.length;
    const completedCount = progressDocs.length;
    const progressPercent = totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : 0;
    const currentLesson = lessons.find((lesson) => !completedSet.has(lesson._id.toString())) || null;
    const isCourseCompleted = totalLessons > 0 && completedCount >= totalLessons;

    return {
      totalLessons,
      completedCount,
      progressPercent,
      isCourseCompleted,
      currentLessonId: currentLesson?._id || null,
      nextLessonId: currentLesson?._id || null,
      completedLessonIds: progressDocs.map((doc) => doc.lessonId),
    };
  },

  async markLessonCompleted(courseId, studentId, lessonId) {
    await getAccessContext(courseId, studentId);

    const lessons = await getPublishedLessons(courseId);
    const lessonIndex = lessons.findIndex((lesson) => lesson._id.toString() === lessonId.toString());

    if (lessonIndex === -1) {
      throw new AppError("Lesson not found", 404);
    }

    const progressDocs = await getCompletedLessonIds(courseId, studentId);
    const completedSet = new Set(progressDocs.map((doc) => doc.lessonId.toString()));
    const previousLesson = lessons[lessonIndex - 1];
    const canAccess = lessonIndex === 0 || completedSet.has(lessonId.toString()) || completedSet.has(previousLesson?._id?.toString());

    if (!canAccess) {
      throw new AppError("Please complete the previous lesson before completing this lesson", 403);
    }

    let progress = await LessonProgress.findOne({
      courseId,
      studentId,
      lessonId,
    });

    if (!progress) {
      progress = await LessonProgress.create({
        courseId,
        studentId,
        lessonId,
        completedAt: new Date(),
      });
    }

    const summary = await syncEnrollmentProgress(courseId, studentId);

    return {
      progress,
      summary,
      nextLessonId: summary.nextLessonId,
      isCourseCompleted: summary.isCourseCompleted,
    };
  },

  async getLessonStates(courseId, studentId) {
    const lessons = await getPublishedLessons(courseId);

    const enrollment = await Enrollment.findOne({
      courseId,
      studentId,
      status: "active",
    }).lean();
    const paidOrder = enrollment
      ? null
      : await Order.findOne({
          courseId,
          studentId,
          status: "paid",
        }).lean();

    if (!enrollment && !paidOrder) {
      return buildLessonStates(lessons, [], true);
    }

    const progressDocs = await getCompletedLessonIds(courseId, studentId);
    return buildLessonStates(
      lessons,
      progressDocs.map((doc) => doc.lessonId),
      false
    );
  },
};

export default lessonProgressService;
