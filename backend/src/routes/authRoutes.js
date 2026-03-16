import express from 'express';
import authController from '../controllers/authController.js';
import validators from '../validators/authValidator.js';

const  router = express.Router();

router.post('/register', validators.registerValidationRules, validators.validate, authController.register);
router.post('/login', validators.loginValidationRules, validators.validate, authController.login);

export default router;
