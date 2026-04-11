import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import courseRoutes from './courseRoutes.js';
import teacherRequestRoutes from './teacherRequestRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
router.use('/teacher-requests', teacherRequestRoutes);
router.use('/enrollments', enrollmentRoutes);

export default router;