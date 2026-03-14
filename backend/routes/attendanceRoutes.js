import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { markAttendance, getMyAttendance, getAllAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

// Mark attendance (employee only)
router.post('/mark', authMiddleware, markAttendance);

// Get my attendance (employee only)
router.get('/my-attendance', authMiddleware, getMyAttendance);

// Get all attendance (admin only)
router.get('/all', authMiddleware, roleMiddleware('admin'), getAllAttendance);

export default router;
