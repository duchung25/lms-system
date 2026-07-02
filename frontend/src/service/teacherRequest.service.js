import {teacherRequestApi} from "../api/teacherRequest.api.js";

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
        const list = Array.isArray(payload) ? payload : payload.list;
        return {
            list: Array.isArray(list) ? list : [],
            pendingCount: payload.pendingCount ?? (Array.isArray(list) ? list.filter((item) => item.status === "Pending").length : 0),
        };
    },
    approveTeacherRequest: async (requestId) => {
        const res = await teacherRequestApi.approveTeacherRequest(requestId);
        return res.data?.data?.teacherRequest ?? null;
    },
    rejectTeacherRequest: async (requestId, message = "") => {
        const res = await teacherRequestApi.rejectTeacherRequest(requestId, { message });
        return res.data?.data?.teacherRequest ?? null;
    }
}   
