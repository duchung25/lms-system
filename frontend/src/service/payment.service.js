import { paymentApi } from "../api/payment.api";

export const paymentService = {
    verifyPayment: (paymentData) => {
        return paymentApi.verifyPayment(paymentData);
    }
};