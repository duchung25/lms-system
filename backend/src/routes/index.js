import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './user.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;