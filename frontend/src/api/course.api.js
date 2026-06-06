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
    setPublistCOurse: (courseId, status) => {
        return apiClient.patch(`/courses/${courseId}/publish-status`, { status });
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
    getTeacherDashboard: () => {
        return apiClient.get(`/courses/teacher/dashboard`);
    }
}
