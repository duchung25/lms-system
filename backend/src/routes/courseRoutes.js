import express from 'express';
import courseController from '../controllers/courseController.js';
import courseValidator from '../validators/courseValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import writeAccessMiddleware from '../middlewares/writeAccessMiddleware.js';
import lessonRoutes from './lessonRoutes.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';
import ratingController from '../controllers/ratingController.js';
import ratingValidator from '../validators/ratingValidator.js';
import optionalAuthMiddleware from '../middlewares/optionalAuthMiddleware.js';

const router = express.Router();

router.use('/', lessonRoutes);
router.get('/home-board', courseController.getHomePageCourses);

router.get('/by-teacher/:teacherId', authMiddleware, authorizeMiddleware('teacher', 'admin'), courseController.getCoursesByTeacher);
router.get('/my-courses', authMiddleware, courseController.getMyCourses);
router.patch('/:courseId/publish-status', authMiddleware, writeAccessMiddleware, courseController.setPublishStatus);
router.patch('/:courseId/submit', authMiddleware, writeAccessMiddleware, courseController.submitCourse);
router.patch('/:courseId/review', authMiddleware, authorizeMiddleware('admin'), courseController.reviewCourse);
router.get('/teacher/dashboard', authMiddleware, authorizeMiddleware('teacher'), courseController.getTeacherDashboard);
router.post(
  '/:courseId/ratings',
  authMiddleware,
  authorizeMiddleware('student'),
  ratingValidator.upsertRatingValidationRules,
  ratingValidator.validate,
  ratingController.upsertRating
);
router.put(
  '/:courseId/ratings',
  authMiddleware,
  authorizeMiddleware('student'),
  ratingValidator.upsertRatingValidationRules,
  ratingValidator.validate,
  ratingController.upsertRating
);

router.get(
  '/:courseId/ratings',
  ratingController.getRatingByCourse
);

router.post('/', authMiddleware, authorizeMiddleware('teacher'), courseValidator.createCourseValidationRules, courseValidator.validate, courseController.createCourse);
router.get('/', optionalAuthMiddleware, courseController.getAllCourse);
router.get('/:courseId', optionalAuthMiddleware, courseController.getCourseDetail);
router.patch('/:courseId', authMiddleware, writeAccessMiddleware, courseValidator.updateCourseValidationRules, courseValidator.validate, courseController.updateCourse);
router.delete('/:courseId', authMiddleware, writeAccessMiddleware, courseController.deleteCourse);
router.patch('/:courseId/restore', authMiddleware, writeAccessMiddleware, courseController.restoreCourse);

export default router;