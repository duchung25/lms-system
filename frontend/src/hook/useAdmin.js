
import { useEffect, useState, useCallback } from "react";
import { adminService } from "../service/admin.service.js";
import { getErrorMessage } from "../helpers/error.helper.js";

export const useGetAllUsers = (params) => {
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState([]);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0
    });

    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await adminService.getAllUsers(params);

            setUsers(data.users || []);

            setPagination({
                total: data.total || 0,
                page: data.page || 1,
                limit: data.limit || 5,
                totalPages: data.totalPages || 0
            });

        } catch (err) {
            const message =
                getErrorMessage(err) ||
                "Đã có lỗi xảy ra.";

            setError(message);

        } finally {
            setLoading(false);
        }
    }, [ params ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { users, pagination, loading, error, refetch: fetchData };
};

export const useDeleteUser = () => {
    const [loading, setLoading] = useState(false);

    const deleteUser = async (userId) => {
        setLoading(true);
        try {
            await adminService.deleteUser(userId);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteUser, loading };
}
export const useRestoreUser = () => {
    const [loading, setLoading] = useState(false);

    const restoreUser = async (userId) => {
        setLoading(true);
        try {
            await adminService.restoreUser(userId);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { restoreUser, loading};
}
export const useDeactivateUser = () => {
    const [loading, setLoading] = useState(false);

    const deactivateUser = async (userId) => {
        setLoading(true);
        try {
            await adminService.deactivateUser(userId);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { deactivateUser, loading };
}
export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);

    const resetPassword = async (userId, newPassword) => {
        setLoading(true);
        try {
            await adminService.resetPassword(userId, newPassword);
        } catch (err) {
            const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return { resetPassword, loading};
}
export const useGetDashboardStatistics = () => {
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState("");

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await adminService.getDashboardStatistics();
            setStatistics(data || {});
        } catch (err) {
            const message = getErrorMessage(err) || "Đã có lỗi xảy ra.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);
    return { statistics, loading, error, refetch: fetchStatistics };
}
export const useGetCourseDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [courseStats, setCourseStats] = useState(null);
    const [error, setError] = useState("");

    const fetchCourseStats = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await adminService.getCourseDashboard();
            setCourseStats(data || {});
        } catch (err) {
            const message = getErrorMessage(err) || "Đã có lỗi xảy ra.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourseStats();
    }, [fetchCourseStats]);

    return {
        courseStats,
        loading,
        error,
        refetch: fetchCourseStats
    };
};