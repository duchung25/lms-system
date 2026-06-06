import { orderService } from "../service/order.service";
import { useState, useEffect } from "react";
import { getErrorMessage } from "../helpers/error.helper";

export const useCreateOrder = () => {
    const [loading, setLoading] = useState(false);

    const createOrder = async (courseId) => {
        setLoading(true);
        try {
            const order = await orderService.createOrder(courseId);
            return order;
        } catch (err) {
            throw new Error(getErrorMessage(err) || "Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, loading };
};

export const useGetOrderById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);
    
    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const orderId = window.location.pathname.split("/payment/")[1];
                const data = await orderService.getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                setError(getErrorMessage(err) || "Failed to fetch order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);
    return { order, loading, error };
};

export const useGetAdminOrderDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await orderService.getAdminOrderDashboard();
                setDashboardData(data);
            } catch (err) {
                setError(getErrorMessage(err) || "Failed to fetch dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { dashboardData, loading, error };
};

export const useGetTeacherOrderDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await orderService.getTeacherOrderDashboard();
                setDashboardData(data);
            } catch (err) {
                setError(getErrorMessage(err) || "Failed to fetch dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { dashboardData, loading, error };
};
