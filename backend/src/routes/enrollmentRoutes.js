import express from "express";
import enrollmentController from "../controllers/enrollmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeMiddleware from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Student
router.get("/me", authorizeMiddleware("student"), enrollmentController.getMyEnrollments);
router.post("/", authorizeMiddleware("student"), enrollmentController.enrollInCourse);
router.delete("/:courseId", authorizeMiddleware("student"), enrollmentController.unenrollFromCourse);

// Teacher
router.get("/courses/:courseId", authorizeMiddleware("teacher"), enrollmentController.getCourseEnrollments);

export default router;