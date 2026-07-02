import express from 'express';
import certificateController from '../controllers/certificateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeMiddleware from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Public
router.get('/verify/:code', certificateController.verifyCertificate);

// Student
router.post('/generate', authMiddleware, authorizeMiddleware('student'), certificateController.generateCertificate);
router.get('/my-certificates', authMiddleware, authorizeMiddleware('student'), certificateController.getMyCertificates);

// Admin
router.get('/admin/all', authMiddleware, authorizeMiddleware('admin'), certificateController.getAllCertificates);
router.patch('/admin/:id/revoke', authMiddleware, authorizeMiddleware('admin'), certificateController.revokeCertificate);

router.get('/:id', authMiddleware, certificateController.getCertificateById);

export default router;
