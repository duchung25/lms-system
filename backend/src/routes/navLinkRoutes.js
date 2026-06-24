import express from 'express';
import navLinkController from '../controllers/navLinkController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Public route: anyone can read nav links (for Header)
router.get('/', navLinkController.getAllNavLinks);

// Admin-only routes: create, update, delete
router.post('/', authMiddleware, authorizeMiddleware('admin'), navLinkController.createNavLink);
router.get('/:id', authMiddleware, authorizeMiddleware('admin'), navLinkController.getNavLinkById);
router.put('/:id', authMiddleware, authorizeMiddleware('admin'), navLinkController.updateNavLink);
router.delete('/:id', authMiddleware, authorizeMiddleware('admin'), navLinkController.deleteNavLink);

export default router;
