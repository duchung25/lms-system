import express from 'express';
import teacherRequestController from '../controllers/teacherRequestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, authorizeMiddleware("student"), teacherRequestController.createTeacherRequest);
router.get("/me", authMiddleware, teacherRequestController.getMyRequest);

// Admin actions
router.get("/", authMiddleware, authorizeMiddleware("admin"), teacherRequestController.getAllTeacherRequests);
router.patch("/:id/approve", authMiddleware, authorizeMiddleware("admin"), teacherRequestController.approveTeacherRequest);
router.patch("/:id/reject", authMiddleware, authorizeMiddleware("admin"), teacherRequestController.rejectTeacherRequest);

export default router;