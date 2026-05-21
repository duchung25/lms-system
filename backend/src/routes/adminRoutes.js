import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

router.use(authMiddleware, authorizeMiddleware('admin'));

router.get("/dashboard/statistics", adminController.getDashboardStatistics);

router.get('/users', adminController.getAllUsers);
router.get('/users/email', adminController.getUserByEmail);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/restore', adminController.restoreUser);
router.patch('/users/:id/deactivate', adminController.deactivateUser);
router.patch('/users/:id/reset-password', adminController.resetPassword);

export default router;
