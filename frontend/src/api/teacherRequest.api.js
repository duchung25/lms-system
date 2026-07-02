import apiClient from './apiClient';

export const teacherRequestApi = {
    createTeacherRequest: (requestData) => {
        return apiClient.post('/teacher-requests', requestData);
    },
    getMyRequest: () => {
        return apiClient.get('/teacher-requests/me');
    },
    getAllTeacherRequests: (params) => {
        return apiClient.get('/teacher-requests', { params });
    },
    approveTeacherRequest: (requestId) => {
        return apiClient.patch(`/teacher-requests/${requestId}/approve`);   
    },
    rejectTeacherRequest: (requestId, payload = {}) => {
        return apiClient.patch(`/teacher-requests/${requestId}/reject`, payload);
    }
}
