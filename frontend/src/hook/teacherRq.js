import teacherRequestService from "../services/teacherRequestService";
import { useState, useEffect, useCallback } from "react";
import { getErrorMessage } from "../helpers/error.helper";

export const useCreateTeacherRequest = () => {
    const [loading, setLoading] = useState(false);
    const [teacherRequest, setTeacherRequest] = useState(null);

    const createTeacherRequest = async (requestData) => {
        setLoading(true);
        try{
            const data = await teacherRequestService.createTeacherRequest(requestData);
            setTeacherRequest(data);
        } catch (error) {
            const message = getErrorMessage(error) || "Đã có lỗi xảy ra.";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { createTeacherRequest, teacherRequest, loading };
}

export const useGetMyTeacherRequest = () => {
    const [loading, setLoading] = useState(false);
    const [teacherRequest, setTeacherRequest] = useState(null);
    const [error, setError] = useState("");

    const fetchMyRequest = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await teacherRequestService.getMyRequest();
            setTeacherRequest(data);
        } catch (error) {
            const message = getErrorMessage(error) || "Đã có lỗi xảy ra.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequest();
    }, []);

    return { teacherRequest, loading, error, refetch: fetchMyRequest };
}

export const useGetAllTeacherRequests = (params) => {
    const [loading, setLoading] = useState(false);
    const [teacherRequests, setTeacherRequests] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await teacherRequestService.getAllTeacherRequests(params);

            setTeacherRequests(data.list);
            setPendingCount(data.pendingCount);
        } catch (error) {
            const message = getErrorMessage(error) || "Đã có lỗi xảy ra.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        teacherRequests,
        pendingCount,
        loading,
        error,
        refetch: fetchData
    };
};

export const useApproveTeacherRequest = () => {
    const [loading, setLoading] = useState(false);

    const approveRequest = async (requestId) => {
        setLoading(true);
        try {
            await teacherRequestService.approveTeacherRequest(requestId);
        } catch (error) {
            const message = getErrorMessage(error) || "Đã có lỗi xảy ra.";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { approveRequest, loading };
};

export const useRejectTeacherRequest = () => {
    const [loading, setLoading] = useState(false);  

    const rejectRequest = async (requestId) => {
        setLoading(true);
        try {
            await teacherRequestService.rejectTeacherRequest(requestId);
        } catch (error) {
            const message = getErrorMessage(error) || "Đã có lỗi xảy ra.";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { rejectRequest, loading };
}