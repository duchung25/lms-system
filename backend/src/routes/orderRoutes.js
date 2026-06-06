import express from "express";
import orderController from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeMiddleware from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeMiddleware("student"), orderController.createOrder);
router.get("/:orderId", authMiddleware, authorizeMiddleware("student"), orderController.getOrderById);
router.get("/admin/dashboard", authMiddleware, authorizeMiddleware("admin"), orderController.getAdminOrderDashboard);
router.get("/teacher/dashboard", authMiddleware, authorizeMiddleware("teacher"), orderController.getTeacherOrderDashboard);

export default router;