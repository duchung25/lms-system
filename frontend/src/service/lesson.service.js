import { lessonApi } from "../api/lesson.api";

export const lessonService = {
  async getLessons(courseId, params) {
    const res = await lessonApi.getLessons(courseId, params);
    const payload = res.data?.data || {};

    return {
      list: Array.isArray(payload.lessons) ? payload.lessons : [],
    };
  },

  async getLesson(courseId, lessonId) {
    const res = await lessonApi.getLesson(courseId, lessonId);
    return res.data?.data?.lesson ?? null;
  },

  async createLesson(courseId, lessonData) {
    const res = await lessonApi.createLesson(courseId, lessonData);
    return res.data?.data?.lesson ?? null;
  },

  async updateLesson(courseId, lessonId, updateData) {
    const res = await lessonApi.updateLesson(courseId, lessonId, updateData);
    return res.data?.data?.lesson ?? null;
  },

  async deleteLesson(courseId, lessonId) {
    const res = await lessonApi.deleteLesson(courseId, lessonId);
    return res.data?.data?.lesson ?? null;
  },

  async completeLesson(courseId, lessonId) {
    const res = await lessonApi.completeLesson(courseId, lessonId);
    return res.data?.data ?? null;
  },

  async getCourseProgress(courseId) {
    const res = await lessonApi.getCourseProgress(courseId);
    return res.data?.data?.progress ?? null;
  },

  async getUnlockedLessons(courseId) {
    const res = await lessonApi.getUnlockedLessons(courseId);
    return Array.isArray(res.data?.data?.lessons) ? res.data.data.lessons : [];
  },
};