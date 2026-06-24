import teacherRequestApi from "../api/teacherRequest.api";

export const teacherRequestService = {
    createTeacherRequest: async (requestData) => {
        const res = await teacherRequestApi.createTeacherRequest(requestData);
        return res.data?.data?.teacherRequest ?? null;
    },
    getMyRequest: async () => {
        const res = await teacherRequestApi.getMyRequest();
        return res.data?.data?.teacherRequest ?? null;
    },
    getAllTeacherRequests: async (params) => {
        const res = await teacherRequestApi.getAllTeacherRequests(params);
        const payload = res.data?.data?.teacherRequests || {};  
        return {
            list: Array.isArray(payload.list) ? payload.list : [],
            pendingCount: payload.pendingCount ?? 0,
        };
    },
    approveTeacherRequest: async (requestId) => {
        const res = await teacherRequestApi.approveTeacherRequest(requestId);
        return res.data?.data?.teacherRequest ?? null;
    },
    rejectTeacherRequest: async (requestId) => {
        const res = await teacherRequestApi.rejectTeacherRequest(requestId);
        return res.data?.data?.teacherRequest ?? null;
    }
}   