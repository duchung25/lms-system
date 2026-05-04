import express from "express";
import enrollmentController from "../controllers/enrollmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeMiddleware from "../middlewares/authorizeMiddleware.js";
const router = express.Router();

router.use(authMiddleware);

router.post("/:courseId" ,authorizeMiddleware("student"), enrollmentController.enrollInCourse);
router.delete("/:courseId",authorizeMiddleware("student"), enrollmentController.unenrollFromCourse);
router.patch("/:courseId/progress", authorizeMiddleware("student"), enrollmentController.updateLearningProgress);
router.patch("/:courseId/lessons/:lessonId/complete", authorizeMiddleware("student"), enrollmentController.completeLesson);
router.get("/enrolled", authorizeMiddleware("student"), enrollmentController.getMyEnrolledCourses);

router.get("/courses/:courseId", authorizeMiddleware("teacher"), enrollmentController.getCourseEnrollments);

export default router;
