import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getAllLeaves, updateLeaveStatus } from '../controllers/adminLeaveController.js';

const router = express.Router();

// Get all leaves (admin only)
router.get('/admin/leaves', authMiddleware, roleMiddleware('admin'), getAllLeaves);

// Update leave status (admin only)
router.put('/admin/leaves/:leaveId', authMiddleware, roleMiddleware('admin'), updateLeaveStatus);

export default router;
