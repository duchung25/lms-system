import { commentApi } from "../api/comment.api";

export const commentService = {
  async getComments(courseId, lessonId) {
    const res = await commentApi.getComments(courseId, lessonId);
    return Array.isArray(res.data?.data?.comments) ? res.data.data.comments : [];
  },

  async getReplies(courseId, lessonId, commentId) {
    const res = await commentApi.getReplies(courseId, lessonId, commentId);
    return Array.isArray(res.data?.data?.replies) ? res.data.data.replies : [];
  },

  async createComment(courseId, lessonId, content, parentCommentId = null) {
    const payload = { content };
    if (parentCommentId) {
      payload.parentCommentId = parentCommentId;
    }

    const res = await commentApi.createComment(courseId, lessonId, payload);
    return res.data?.data?.comment ?? null;
  },

  async createReply(courseId, lessonId, commentId, content) {
    return commentService.createComment(courseId, lessonId, content, commentId);
  },

  async updateComment(courseId, lessonId, commentId, content) {
    const res = await commentApi.updateComment(courseId, lessonId, commentId, { content });
    return res.data?.data?.comment ?? null;
  },

  async deleteComment(courseId, lessonId, commentId) {
    const res = await commentApi.deleteComment(courseId, lessonId, commentId);
    return res.data?.message ?? "Comment deleted successfully";
  },
};
