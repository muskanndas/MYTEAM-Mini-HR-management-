import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getAllUsers, getUserById } from '../controllers/adminUserController.js';

const router = express.Router();

// Get all users (admin only)
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), getAllUsers);

// Get user by ID (admin only)
router.get('/admin/users/:userId', authMiddleware, roleMiddleware('admin'), getUserById);

export default router;
