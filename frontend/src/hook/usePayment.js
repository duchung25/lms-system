import { useState } from "react";
import { paymentService } from "../service/payment.service";
import { getErrorMessage } from "../helpers/error.helper";

export const usePayment = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const verifyPayment = async (paymentData) => {
        setIsLoading(true);
        try {
            const response = await paymentService.verifyPayment(paymentData);
            setPaymentStatus(response.data);
        } catch (err) {
            throw new Error(getErrorMessage(err) || "Payment verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { paymentStatus, isLoading, verifyPayment };
};