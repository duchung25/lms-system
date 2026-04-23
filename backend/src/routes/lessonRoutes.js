import express from 'express';
import lessonController from '../controllers/lessonController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import writeAccessMiddleware from '../middlewares/writeAccessMiddleware.js';
import readAccessMiddleware from '../middlewares/readAccessMiddleware.js';

const router = express.Router();

router.post('/:courseId/lessons', authMiddleware, writeAccessMiddleware, lessonController.createLesson);
router.get('/:courseId/lessons', authMiddleware, lessonController.getLessonsByCourse);
router.get('/:courseId/lessons/:lessonId', authMiddleware, readAccessMiddleware, lessonController.getLessonDetail);
router.patch('/:courseId/lessons/:lessonId', authMiddleware, writeAccessMiddleware, lessonController.updateLesson);
router.delete('/:courseId/lessons/:lessonId', authMiddleware, writeAccessMiddleware, lessonController.deleteLesson);

export default router;