import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getDashboardStats } from '../controllers/adminDashboardController.js';

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/admin/dashboard', authMiddleware, roleMiddleware('admin'), getDashboardStats);

export default router;
