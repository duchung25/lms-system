import express from 'express';
import authController from '../controllers/authController.js';
import validators from '../validators/authValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const  router = express.Router();

router.post('/register', validators.registerValidationRules, validators.validate, authController.register);
router.post('/login', validators.loginValidationRules, validators.validate, authController.login);

// Protected route 
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

router.post('/courses', authMiddleware, authorizeMiddleware('teacher', 'admin'), authController.createCourse);
router.delete('/users/:id', authMiddleware, authorizeMiddleware('admin'), authController.deleteUser);
export default router;
