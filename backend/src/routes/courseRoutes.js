import express from 'express';
import courseController from '../controllers/courseController.js';
import courseValidator from '../validators/courseValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

//Specific router 
router.get('/by-teacher/:id', courseController.getCoursesByTeacher);
router.post('/:id/enrollments', authMiddleware, authorizeMiddleware('student'), courseController.enrollStudent);
router.delete('/enrollments/:id', authMiddleware, authorizeMiddleware('student'), courseController.unenrollStudent);

router.post('/', authMiddleware, authorizeMiddleware('teacher'), courseValidator.createCourseValidationRules, courseValidator.validate, courseController.createCourse);
router.get('/', courseController.getAllCourse);
router.get('/:id', courseController.getCourseById);
router.patch('/:id', authMiddleware, authorizeMiddleware('teacher'), courseValidator.updateCourseValidationRules, courseValidator.validate, courseController.updateCourse);
router.delete('/:id', authMiddleware, authorizeMiddleware('admin', 'teacher'), courseController.deleteCourse);
router.post('/:id/restore', authMiddleware, authorizeMiddleware('admin'), courseController.restoreCourse);


export default router;