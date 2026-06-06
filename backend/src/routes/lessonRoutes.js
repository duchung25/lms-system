import express from 'express';
import lessonController from '../controllers/lessonController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import writeAccessMiddleware from '../middlewares/writeAccessMiddleware.js';
import readAccessMiddleware from '../middlewares/readAccessMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';
import commentController from '../controllers/commentController.js';
import commentValidator from '../validators/commentValidator.js';

const router = express.Router();

router.post('/:courseId/lessons', authMiddleware, writeAccessMiddleware, lessonController.createLesson);
router.get('/:courseId/lessons', authMiddleware, lessonController.getLessonsByCourse);
router.get('/:courseId/lessons/:lessonId', authMiddleware, readAccessMiddleware, lessonController.getLessonDetail);
router.patch('/:courseId/lessons/:lessonId', authMiddleware, writeAccessMiddleware, lessonController.updateLesson);
router.delete('/:courseId/lessons/:lessonId', authMiddleware, writeAccessMiddleware, lessonController.deleteLesson);
router.post('/:courseId/lessons/:lessonId/complete', authMiddleware, authorizeMiddleware('student'), lessonController.completeLesson);
router.get('/:courseId/progress', authMiddleware, authorizeMiddleware('student'), lessonController.getCourseProgress);
router.get('/:courseId/unlocked-lessons', authMiddleware, authorizeMiddleware('student'), lessonController.getUnlockedLessons);
router.get('/:courseId/lessons/:lessonId/comments', authMiddleware, readAccessMiddleware, commentController.getComments);
router.post(
  '/:courseId/lessons/:lessonId/comments',
  authMiddleware,
  readAccessMiddleware,
  commentValidator.createCommentValidationRules,
  commentValidator.validate,
  commentController.createComment
);
router.patch(
  '/:courseId/lessons/:lessonId/comments/:commentId',
  authMiddleware,
  readAccessMiddleware,
  commentValidator.updateCommentValidationRules,
  commentValidator.validate,
  commentController.updateComment
);
router.delete(
  '/:courseId/lessons/:lessonId/comments/:commentId',
  authMiddleware,
  readAccessMiddleware,
  commentController.deleteComment
);

export default router;