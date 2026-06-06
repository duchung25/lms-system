import paymentService from "../services/paymentService.js";

const paymentController = {
    async verifyPayment(req, res, next) {
        try {
            const { orderId } = req.body;

            const result = await paymentService.verifyPayment(orderId);

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default paymentController;