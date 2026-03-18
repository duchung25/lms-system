import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();
// các router đều yêu cầu xác thực và phải có role admin
router.use(authMiddleware, authorizeMiddleware('admin'));
// CRUD USERS
router.get('/users', adminController.getAllAdmin);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUserById);
router.delete('/users/:id', adminController.deleteUserById);
// Thống kê
router.get('/state', adminController.getState);

export default router;
