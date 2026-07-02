import express from 'express';
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/stats/summary', authMiddleware, authorizeMiddleware('admin'), categoryController.getCategoryStats);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post('/', authMiddleware, authorizeMiddleware('admin'), categoryController.createCategory);
router.put('/:id', authMiddleware, authorizeMiddleware('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, authorizeMiddleware('admin'), categoryController.deleteCategory);
router.patch('/:id/status', authMiddleware, authorizeMiddleware('admin'), categoryController.updateCategoryStatus);

export default router;
