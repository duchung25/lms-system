import {  useEffect, useState } from 'react';
import { adminService } from '../service/admin.service.js';
import { getErrorMessage } from '../helpers/error.helper.js';

export const useGetAllUsers = (params) => {
    const [ loading, setLoading ] = useState(false);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0
    });
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await adminService.getAllUsers(params);
                console.log("Fetched users data", data);
                setUsers(data.users || []);
                setPagination({
                    total: data.total || 0,
                    page: data.page || 1,
                    limit: data.limit || 5,
                    totalPages: data.totalPages || 0
                });
            } catch (err) {
                const message = getErrorMessage(err) || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params]);
    return { users, pagination, loading, error };
};