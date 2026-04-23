import express from 'express';
import authController from '../controllers/authController.js';
import validators from '../validators/authValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const  router = express.Router();

router.post('/register', validators.registerValidationRules, validators.validate, authController.register);
router.post('/login', validators.loginValidationRules, validators.validate, authController.login);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

export default router;
