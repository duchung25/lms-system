import express from "express";
import enrollmentController from "../controllers/enrollmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeMiddleware from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Student
router.get("/me/enrollments", authorizeMiddleware("student"), enrollmentController.getMyEnrollments);
router.post("/courses/:courseId/enrollments", authorizeMiddleware("student"), enrollmentController.enrollInCourse);
router.delete("/courses/:courseId/enrollments/me", authorizeMiddleware("student"), enrollmentController.unenrollFromCourse);

// Teacher
router.get("/courses/:courseId/enrollments", authorizeMiddleware("teacher"), enrollmentController.getCourseEnrollments);

export default router;