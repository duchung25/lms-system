import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();
// các router đều yêu cầu xác thực và phải có role admin
router.use(authMiddleware, authorizeMiddleware('admin'));
// CRUD USERS
router.get('/users', adminController.getAllUser);
router.get('/users/email', adminController.getUserByEmail);
router.get('/users/:id', adminController.getUserById);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/restore', adminController.restoreUser);
router.put('/users/:id/deactivate', adminController.deactivateUser);
router.put('/users/:id/reset-password', adminController.resetPassword);

export default router;
