import apiClient from "./apiClient";

export const lessonApi = {
    getLessons: (courseId, params) => {
        return apiClient.get(`/courses/${courseId}/lessons`, { params });
    },  
    createLesson: (courseId, lessonData) => {
        return apiClient.post(`/courses/${courseId}/lessons`, lessonData);
    },
    getLesson: (courseId, lessonId) => {
        return apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);
    },
    updateLesson: (courseId, lessonId, updateData) => {
        return apiClient.patch(`/courses/${courseId}/lessons/${lessonId}`, updateData);
    },
    deleteLesson: (courseId, lessonId) => {
        return apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
    },
    completeLesson: (courseId, lessonId) => {
        return apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
    },
    getCourseProgress: (courseId) => {
        return apiClient.get(`/courses/${courseId}/progress`);
    },
    getUnlockedLessons: (courseId) => {
        return apiClient.get(`/courses/${courseId}/unlocked-lessons`);
    },
    // restoreLesson: (courseId, lessonId) => {
    //     return apiClient.patch(`/courses/${courseId}/lessons/${lessonId}/restore`);
    // }
}