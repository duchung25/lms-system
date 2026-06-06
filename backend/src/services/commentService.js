import LessonComment from "../models/LessonComment.js";
import Lesson from "../models/Lesson.js";
import AppError from "../utils/AppError.js";
import enrollmentService from "./enrollmentService.js";

const populateComment = async (commentId) => {
  return LessonComment.findById(commentId)
    .populate("authorId", "username avatar")
    .lean();
};

const ensureLessonExists = async (courseId, lessonId) => {
  const lesson = await Lesson.findOne({ _id: lessonId, courseId }).lean();
  if (!lesson) {
    throw new AppError("Lesson not found", 404);
  }
  return lesson;
};

const commentService = {
  async getComments(courseId, lessonId) {
    await ensureLessonExists(courseId, lessonId);

    const comments = await LessonComment.find({ courseId, lessonId })
      .populate("authorId", "username avatar")
      .sort({ createdAt: 1 })
      .lean();

    return comments.map((comment) => ({
      ...comment,
      authorName: comment.authorId?.username || "Unknown",
      authorAvatar: comment.authorId?.avatar || "",
    }));
  },

  async createComment(courseId, lessonId, user, content) {
    if (user.role !== "student") {
      throw new AppError("Only students can post comments", 403);
    }

    await ensureLessonExists(courseId, lessonId);
    await enrollmentService.canAccessLesson(courseId, user.userId, lessonId);

    const comment = await LessonComment.create({
      courseId,
      lessonId,
      authorId: user.userId,
      content,
    });

    const populated = await populateComment(comment._id);
    return {
      ...populated,
      authorName: populated.authorId?.username || "Unknown",
      authorAvatar: populated.authorId?.avatar || "",
    };
  },

  async updateComment(courseId, lessonId, commentId, user, content) {
    const comment = await LessonComment.findOne({
      _id: commentId,
      courseId,
      lessonId,
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (user.role !== "student" || !comment.authorId.equals(user.userId)) {
      throw new AppError("You can only edit your own comments", 403);
    }

    comment.content = content;
    await comment.save();

    const populated = await populateComment(comment._id);
    return {
      ...populated,
      authorName: populated.authorId?.username || "Unknown",
      authorAvatar: populated.authorId?.avatar || "",
    };
  },

  async deleteComment(courseId, lessonId, commentId, user) {
    const comment = await LessonComment.findOne({
      _id: commentId,
      courseId,
      lessonId,
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const isOwner = user.role === "student" && comment.authorId.equals(user.userId);
    const isStaff = ["teacher", "admin"].includes(user.role);

    if (!isOwner && !isStaff) {
      throw new AppError("You do not have permission to delete this comment", 403);
    }

    await comment.deleteOne();
    return { message: "Comment deleted successfully" };
  },
};

export default commentService;
