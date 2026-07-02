import apiClient from "./apiClient";

export const commentApi = {
  getComments: (courseId, lessonId) => {
    return apiClient.get(`/courses/${courseId}/lessons/${lessonId}/comments`);
  },
  getReplies: (courseId, lessonId, commentId) => {
    return apiClient.get(`/courses/${courseId}/lessons/${lessonId}/comments/${commentId}/replies`);
  },
  createComment: (courseId, lessonId, payload) => {
    return apiClient.post(`/courses/${courseId}/lessons/${lessonId}/comments`, payload);
  },
  updateComment: (courseId, lessonId, commentId, payload) => {
    return apiClient.patch(
      `/courses/${courseId}/lessons/${lessonId}/comments/${commentId}`,
      payload
    );
  },
  deleteComment: (courseId, lessonId, commentId) => {
    return apiClient.delete(`/courses/${courseId}/lessons/${lessonId}/comments/${commentId}`);
  },
};
