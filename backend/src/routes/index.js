import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './user.js';
import adminRoutes from './adminRoutes.js';
import courseRoutes from './courseRoutes.js';
// import teacherRequestRoutes from './teacherRequestRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
// router.use('/teacher-requests', teacherRequestRoutes);

export default router;