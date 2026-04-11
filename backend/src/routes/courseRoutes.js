import express from 'express';
import courseController from '../controllers/courseController.js';
import courseValidator from '../validators/courseValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import writeAccessMiddleware from '../middlewares/writeAccessMiddleware.js';

const router = express.Router();

router.get('/by-teacher/:teacherId', courseController.getCoursesByTeacher);
router.get('/my-courses', authMiddleware, writeAccessMiddleware, courseController.getTeachingCourses);
router.post('/:courseId/publish', authMiddleware, writeAccessMiddleware, courseController.publishCourse);
router.post('/:courseId/unpublish', authMiddleware, writeAccessMiddleware, courseController.unpublishCourse);

router.post('/', authMiddleware, writeAccessMiddleware, courseValidator.createCourseValidationRules, courseValidator.validate, courseController.createCourse);
router.get('/', courseController.getAllCourse);
router.get('/:courseId', courseController.getCourseById);
router.patch('/:courseId', authMiddleware, writeAccessMiddleware, courseValidator.updateCourseValidationRules, courseValidator.validate, courseController.updateCourse);
router.delete('/:courseId', authMiddleware, writeAccessMiddleware, courseController.deleteCourse);
router.post('/:courseId/restore', authMiddleware, writeAccessMiddleware, courseController.restoreCourse);

export default router;