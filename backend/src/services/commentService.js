import LessonComment from "../models/LessonComment.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import AppError from "../utils/AppError.js";
import enrollmentService from "./enrollmentService.js";
import notificationService from "./notificationService.js";

const populateComment = async (commentId) => {
  return LessonComment.findById(commentId)
    .populate("authorId", "username avatar")
    .lean();
};

const formatComment = (comment) => ({
  ...comment,
  authorName: comment.authorId?.username || "Unknown",
  authorAvatar: comment.authorId?.avatar || "",
  authorRole: comment.authorId?.role || "student",
  replies: Array.isArray(comment.replies) ? comment.replies : [],
});

const buildCommentTree = (comments) => {
  const nodes = new Map();
  const roots = [];

  comments.forEach((comment) => {
    nodes.set(String(comment._id), {
      ...formatComment(comment),
      replies: [],
    });
  });

  comments.forEach((comment) => {
    const node = nodes.get(String(comment._id));
    const parentId = comment.parentCommentId ? String(comment.parentCommentId) : null;

    if (parentId && nodes.has(parentId)) {
      nodes.get(parentId).replies.push(node);
      return;
    }

    roots.push(node);
  });

  return roots;
};

const getAllDescendantIds = async (commentId) => {
  const descendantIds = [];
  let currentLevel = [commentId];

  while (currentLevel.length > 0) {
    const children = await LessonComment.find({
      parentCommentId: { $in: currentLevel },
    }).select("_id");

    if (children.length === 0) {
      break;
    }

    currentLevel = children.map((child) => String(child._id));
    descendantIds.push(...currentLevel);
  }

  return descendantIds;
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
      .populate("authorId", "username avatar role")
      .sort({ createdAt: 1 })
      .lean();

    return buildCommentTree(comments);
  },

  async getReplies(courseId, lessonId, parentCommentId) {
    await ensureLessonExists(courseId, lessonId);

    const replies = await LessonComment.find({ courseId, lessonId, parentCommentId })
      .populate("authorId", "username avatar role")
      .sort({ createdAt: 1 })
      .lean();

    return replies.map((reply) => formatComment(reply));
  },

  async createComment(courseId, lessonId, user, content, parentCommentId = null) {
    if (!content?.trim()) {
      throw new AppError("Comment content is required", 400);
    }

    await ensureLessonExists(courseId, lessonId);

    if (!parentCommentId && user.role !== "student") {
      throw new AppError("Only students can post top-level comments", 403);
    }

    if (user.role === "student") {
        await enrollmentService.canAccessLesson(courseId, user.userId, lessonId);
    }

    let parent = null;
    if (parentCommentId) {
        parent = await LessonComment.findOne({ _id: parentCommentId, courseId, lessonId });
        if (!parent) throw new AppError("Parent comment not found", 404);
    }

    const comment = await LessonComment.create({
      courseId,
      lessonId,
      authorId: user.userId,
      content: content.trim(),
      parentCommentId
    });

    if (parentCommentId) {
      await LessonComment.updateOne(
        { _id: parentCommentId, courseId, lessonId },
        { $inc: { replyCount: 1 } }
      );
    }

    const populated = await populateComment(comment._id);
    const course = await Course.findById(courseId).select("title teacherId").lean();
    const recipientId = parentCommentId ? parent.authorId : course?.teacherId;

    if (recipientId && recipientId.toString() !== user.userId.toString()) {
      await notificationService.createNotification({
        userId: recipientId,
        title: "Bình luận bài học mới",
        message: parentCommentId
          ? "Bình luận của bạn vừa có phản hồi mới."
          : `Khóa học ${course?.title || ""} vừa có bình luận mới.`.trim(),
        type: "NEW_LESSON_COMMENT",
        referenceId: comment._id,
        referenceType: "LessonComment",
        link: `/courses/${courseId}/lessons/${lessonId}`,
      });
    }
    return formatComment(populated);
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

    if (!content?.trim()) {
      throw new AppError("Comment content is required", 400);
    }

    comment.content = content.trim();
    comment.editedAt = new Date();
    await comment.save();

    const populated = await populateComment(comment._id);
    return formatComment(populated);
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

    const isOwner = comment.authorId.equals(user.userId);
    const isStaff = ["teacher", "admin"].includes(user.role);

    if (!isOwner && !isStaff) {
      throw new AppError("You do not have permission to delete this comment", 403);
    }

    const descendantIds = await getAllDescendantIds(commentId);
    const idsToDelete = [String(commentId), ...descendantIds];

    if (comment.parentCommentId) {
      await LessonComment.updateOne(
        { _id: comment.parentCommentId },
        { $inc: { replyCount: -1 } }
      );
    }

    await LessonComment.deleteMany({ _id: { $in: idsToDelete } });

    return { message: "Comment deleted successfully" };
  },
};

export default commentService;
