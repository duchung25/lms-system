import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

// Validation rules for user registration
    const registerValidationRules = [
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 3, max:20 })
            .withMessage('Username must be between 3 and 20 characters')
            .custom(async(username) => {
                const existingUser = await User.findOne({username});
                if(existingUser) {
                    throw new Error('Username already in use')
                }
            }),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .normalizeEmail()
            .custom(async(email) => {
                const existingEmail = await User.findOne({email});
                if(existingEmail) {
                    throw new Error('Email already in use')
                }
            }),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password phải chứa chữ hoa, chữ thường và số'),
    ];
    // Validation rules for user login
    const loginValidationRules = [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ];
    // Middleware to handle validation results
    const validate = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg
                }))
            });
        }
        next();
    }

    export default {
        registerValidationRules,
        loginValidationRules,
        validate
    }
