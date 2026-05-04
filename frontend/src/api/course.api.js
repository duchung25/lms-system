import apiClient from "./apiClient";

export const courseApi = {
    getCourses: (params) => {
        return apiClient.get("/courses", { params });
    },
    createCourse: (courseData) => {
        return apiClient.post("/courses", courseData);
    },
    getCourseDetail: (courseId) => {
        return apiClient.get(`/courses/${courseId}`);
    },
    updateCourse: (courseId, updateData) => {
        return apiClient.patch(`/courses/${courseId}`, updateData);
    },
    deleteCourse: (courseId) => {
        return apiClient.delete(`/courses/${courseId}`);
    },
    restoreCourse: (courseId) => {
        return apiClient.patch(`/courses/${courseId}/restore`);
    },
    getCourseByTeacherId: (teacherId) => {
        return apiClient.get(`/courses/by-teacher/${teacherId}`);
    },
    publishCourse: (courseId) => {
        return apiClient.patch(`/courses/${courseId}/publish`);
    },
    unpublishCourse: (courseId) => {
        return apiClient.patch(`/courses/${courseId}/unpublish`);
    },
    enrollCourse: (courseId) => {
        return apiClient.post(`/enrollments/${courseId}`);
    },
    unenrollCourse: (courseId) => {
        return apiClient.delete(`/enrollments/${courseId}`);
    },
    updateLearningProgress: (courseId, lessonId) => {
        return apiClient.patch(`/enrollments/${courseId}/progress`, { lessonId });
    },
    completeLesson: (courseId, lessonId) => {
        return apiClient.patch(`/enrollments/${courseId}/lessons/${lessonId}/complete`);
    },
    getMyCourses: () => {
        return apiClient.get(`/courses/my-courses`);
    },
    getEnrolledCourses: () => {
        return apiClient.get(`/enrollments/enrolled`);
    },
}
