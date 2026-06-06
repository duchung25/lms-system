import { commentApi } from "../api/comment.api";

export const commentService = {
  async getComments(courseId, lessonId) {
    const res = await commentApi.getComments(courseId, lessonId);
    return Array.isArray(res.data?.data?.comments) ? res.data.data.comments : [];
  },

  async createComment(courseId, lessonId, content) {
    const res = await commentApi.createComment(courseId, lessonId, { content });
    return res.data?.data?.comment ?? null;
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
