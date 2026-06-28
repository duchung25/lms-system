import mongoose from "mongoose";
import CourseRating from "../models/CourseRating.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import AppError from "../utils/AppError.js";

const recalculateCourseRating = async (courseId) => {
  const [stats] = await CourseRating.aggregate([
    { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats ? Number(stats.averageRating.toFixed(1)) : 0;
  const ratingCount = stats?.ratingCount ?? 0;

  await Course.findByIdAndUpdate(courseId, {
    averageRating,
    ratingCount,
  });

  return { averageRating, ratingCount };
};

const ratingService = {
  async getMyRating(courseId, studentId) {
    const rating = await CourseRating.findOne({ courseId, studentId }).lean();
    return rating?.rating ?? null;
  },

  async upsertRating(courseId, studentId, ratingValue) {
    const course = await Course.findById(courseId).lean();
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const enrollment = await Enrollment.findOne({
      courseId,
      studentId,
      status: "active",
    }).lean();

    if (!enrollment) {
      throw new AppError("Only enrolled students can rate this course", 403);
    }

    const rating = await CourseRating.findOneAndUpdate(
      { courseId, studentId },
      { rating: ratingValue },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();

    const summary = await recalculateCourseRating(courseId);

    return {
      rating,
      summary,
    };
  },

  async getRatingByCourse(courseId) {
    const ratings = await CourseRating.find({ courseId }).lean();
    return ratings;
  },
  
};

export default ratingService;
