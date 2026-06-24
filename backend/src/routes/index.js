import express from 'express';
import navLinkRoutes from './navLinkRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import courseRoutes from './courseRoutes.js';
import teacherRequestRoutes from './teacherRequestRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/courses', courseRoutes);
router.use('/teacher-requests', teacherRequestRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

router.use('/navlinks', navLinkRoutes);
export default router;