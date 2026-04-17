import express from 'express';
import courseController from '../controllers/courseController.js';
import courseValidator from '../validators/courseValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import writeAccessMiddleware from '../middlewares/writeAccessMiddleware.js';

const router = express.Router();

router.get('/by-teacher/:teacherId', authMiddleware, courseController.getCoursesByTeacher);
router.get('/my-courses', authMiddleware, courseController.getMyCourses);
router.patch('/:courseId/publish', authMiddleware, writeAccessMiddleware, courseController.publishCourse);
router.patch('/:courseId/unpublish', authMiddleware, writeAccessMiddleware, courseController.unpublishCourse);

router.post('/', authMiddleware, courseValidator.createCourseValidationRules, courseValidator.validate, courseController.createCourse);
router.get('/', authMiddleware,  courseController.getAllCourse);
router.get('/:courseId', authMiddleware, courseController.getCourseDetail);
router.patch('/:courseId', authMiddleware, writeAccessMiddleware, courseValidator.updateCourseValidationRules, courseValidator.validate, courseController.updateCourse);
router.delete('/:courseId', authMiddleware, writeAccessMiddleware, courseController.deleteCourse);
router.post('/:courseId/restore', authMiddleware, writeAccessMiddleware, courseController.restoreCourse);

export default router;