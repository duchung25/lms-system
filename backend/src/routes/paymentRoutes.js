import express from "express";
import paymentController from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeMiddleware from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.post("/verify", authMiddleware, authorizeMiddleware("student"), paymentController.verifyPayment);

export default router;