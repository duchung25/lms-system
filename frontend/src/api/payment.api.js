import apiClient from "./apiClient";

export const paymentApi = {
    verifyPayment: (paymentData) => {
        return apiClient.post("/payments/verify", paymentData);
    }
};