import { courseApi } from "../api/course.api";

export const courseService = {
  async getCourses(params) {
    const res = await courseApi.getCourses(params);
    const payload = res.data?.data || {};

    return {
      list: Array.isArray(payload.list) ? payload.list : [],
      pendingCount: payload.pendingCount ?? 0,
    };
  },

  async getCourseDetail(courseId) {
    const res = await courseApi.getCourseDetail(courseId);
    return res.data?.data?.course ?? null;
  },

  async createCourse(courseData) {
    const res = await courseApi.createCourse(courseData);
    return res.data?.data?.course ?? null;
  },

  async updateCourse(courseId, updateData) {
    const res = await courseApi.updateCourse(courseId, updateData);
    return res.data?.data?.course ?? null;
  },

  async deleteCourse(courseId) {
    const res = await courseApi.deleteCourse(courseId);
    return res.data?.data?.course ?? null;
  },

  async restoreCourse(courseId) {
    const res = await courseApi.restoreCourse(courseId);
    return res.data?.data?.course ?? null;
  },

  async getCourseByTeacherId(teacherId) {
    const res = await courseApi.getCourseByTeacherId(teacherId);
    return Array.isArray(res.data?.data?.courses)
      ? res.data.data.courses
      : [];
  },

  async publishCourse(courseId) {
    const res = await courseApi.publishCourse(courseId);
    return res.data?.data?.course ?? null;
  },

  async unpublishCourse(courseId) {
    const res = await courseApi.unpublishCourse(courseId);
    return res.data?.data?.course ?? null;
  },

  async enrollCourse(courseId) {
    const res = await courseApi.enrollCourse(courseId);
    return res.data?.data ?? null;
  },

  async unenrollCourse(courseId) {
    const res = await courseApi.unenrollCourse(courseId);
    return res.data?.data ?? null;
  },

  async updateLearningProgress(courseId, lessonId) {
    const res = await courseApi.updateLearningProgress(courseId, lessonId);
    return res.data?.data?.enrollment ?? null;
  },

  async completeLesson(courseId, lessonId) {
    const res = await courseApi.completeLesson(courseId, lessonId);
    return res.data?.data ?? null;
  },

  async getMyCourses() {
    const res = await courseApi.getMyCourses();
    return Array.isArray(res.data?.data?.courses)
      ? res.data.data.courses
      : [];
  },

  async getEnrolledCourses() {
    const res = await courseApi.getEnrolledCourses();
    return Array.isArray(res.data?.data?.courses)
      ? res.data.data.courses
      : [];
  }
};
