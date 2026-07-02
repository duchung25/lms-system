import { body, validationResult } from 'express-validator';

const createCourseValidationRules = [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 100 })
            .withMessage('Title must be less than 100 characters'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required'),
        body('categoryId')
            .trim()
            .notEmpty().withMessage('Category is required')
            .isMongoId().withMessage('Invalid Category ID'),
        body('level')
            .trim()
            .notEmpty()
            .withMessage('Level is required')
            .isIn(["Beginner", "Intermediate", "Advanced"])
            .withMessage('Invalid level'),
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
];

const updateCourseValidationRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title max 100 characters'),
    
    body('description')
        .optional()
        .trim(),
    
    body('categoryId')
        .optional()
        .isMongoId().withMessage('Invalid Category ID'),
    
    body('level')
        .optional()
        .trim()
        .isIn(["Beginner", "Intermediate", "Advanced"]),
    
    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be >= 0')
];

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
};

export default {
    createCourseValidationRules,
    updateCourseValidationRules,
    validate
}